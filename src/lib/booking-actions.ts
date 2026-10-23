"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Resend } from "resend";
import { render } from "@react-email/render";
import CustomerConfirmation from "@/emails/CustomerConfirmation";
import OwnerAlert from "@/emails/OwnerAlert";

const resend = new Resend(process.env.RESEND_API_KEY || "re_missing_key");

const bookingSchema = z.object({
  tenantId: z.string(),
  serviceId: z.string(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  notes: z.string().optional(),
});

export async function createBookingAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = bookingSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { tenantId, serviceId, name, email, phone, date, time, notes } = parsed.data;

  try {
    const scheduledAt = new Date(`${date}T${time}:00`);
    
    if (isNaN(scheduledAt.getTime())) {
      return { error: "Invalid date or time provided." };
    }

    const startOfMinute = new Date(scheduledAt);
    const endOfMinute = new Date(scheduledAt.getTime() + 60000);

    await prisma.$transaction(async (tx) => {
      const existingBooking = await tx.booking.findFirst({
        where: {
          tenantId,
          scheduledAt: {
            gte: startOfMinute,
            lt: endOfMinute,
          },
          status: { not: "CANCELED" }
        }
      });

      if (existingBooking) {
        throw new Error("This time slot is already booked. Please choose another time.");
      }

      let customer = await tx.customer.findUnique({
        where: { tenantId_email: { tenantId, email } },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: { tenantId, name, email, phone },
        });
      }

      await tx.booking.create({
        data: {
          tenantId,
          customerId: customer.id,
          serviceId,
          scheduledAt,
          notes,
          status: "PENDING",
        },
      });

      // Fetch tenant and service details for the emails
      const tenant = await tx.tenant.findUnique({ where: { id: tenantId } });
      const service = await tx.service.findUnique({ where: { id: serviceId } });

      if (!tenant || !service) throw new Error("Tenant or service not found");

      // Format date/time for the email
      const formattedDate = scheduledAt.toLocaleDateString("en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const formattedTime = scheduledAt.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });

      // 1. Render and Send confirmation to Customer
      const customerHtml = await render(
        CustomerConfirmation({
          customerName: name,
          businessName: tenant.businessName,
          serviceName: service.name,
          date: formattedDate,
          time: formattedTime,
        }) as React.ReactElement
      );

      await resend.emails.send({
        from: process.env.MAIL_FROM || "Plumbflow <onboarding@resend.dev>",
        to: email,
        subject: `Booking Confirmed: ${service.name} with ${tenant.businessName}`,
        html: customerHtml,
      });

      // 2. Render and Send alert to Business Owner
      const ownerHtml = await render(
        OwnerAlert({
          businessName: tenant.businessName,
          customerName: name,
          customerPhone: phone,
          serviceName: service.name,
          date: formattedDate,
          time: formattedTime,
        }) as React.ReactElement
      );

      await resend.emails.send({
        from: process.env.MAIL_FROM || "Plumbflow <onboarding@resend.dev>",
        to: tenant.email,
        subject: `New Booking: ${name} for ${service.name}`,
        html: ownerHtml,
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error("Booking error:", error);
    if (error.message === "This time slot is already booked. Please choose another time.") {
      return { error: error.message };
    }
    return { error: "Something went wrong. Please try again." };
  }
}