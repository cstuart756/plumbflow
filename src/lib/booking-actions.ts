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
    
    if (isNaN(scheduledAt.getTime())) {
      return { error: "Invalid date or time provided." };
    }

    // Create a 1-minute window to prevent millisecond drift issues
    const startOfMinute = new Date(scheduledAt);
    const endOfMinute = new Date(scheduledAt.getTime() + 60000);

    console.log("Checking for conflicts at:", startOfMinute.toISOString());

    await prisma.$transaction(async (tx) => {
      // 1. Check for scheduling conflicts using a range
      const existingBooking = await tx.booking.findFirst({
        where: {
          tenantId,
          scheduledAt: {
            gte: startOfMinute,
            lt: endOfMinute,
          },
          status: { not: "CANCELED" } // Ignore canceled bookings
        }
      });

      if (existingBooking) {
        console.log("Conflict found! Existing booking ID:", existingBooking.id);
        throw new Error("This time slot is already booked. Please choose another time.");
      }

      // 2. Find or create the Customer
      let customer = await tx.customer.findUnique({
        where: { tenantId_email: { tenantId, email } },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: { tenantId, name, email, phone },
        });
      }

      // 3. Create the Booking
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
      console.log("New booking created successfully.");
    });

    return { success: true };
  } catch (error: any) {
    console.error("Booking error:", error);
    // Pass our custom error message up to the client
    if (error.message === "This time slot is already booked. Please choose another time.") {
      return { error: error.message };
    }
    return { error: "Something went wrong. Please try again." };
  }
}