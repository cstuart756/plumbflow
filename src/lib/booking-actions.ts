"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
    // Combine date and time into a single DateTime object
    const scheduledAt = new Date(`${date}T${time}:00`);

    await prisma.$transaction(async (tx) => {
      // 1. Find or create the Customer
      let customer = await tx.customer.findUnique({
        where: { tenantId_email: { tenantId, email } },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: { tenantId, name, email, phone },
        });
      }

      // 2. Create the Booking
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
    });

    return { success: true };
  } catch (error) {
    console.error("Booking error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}