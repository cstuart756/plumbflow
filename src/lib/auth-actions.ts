"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";

const signupSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  name: z.string().min(2, "Your name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signupAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = signupSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { businessName, slug, name, email, password } = parsed.data;

  try {
    // Check if slug is taken
    const existingTenant = await prisma.tenant.findUnique({ where: { slug } });
    if (existingTenant) {
      return { error: "That booking URL is already taken. Please choose another." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create Tenant and User in a transaction
    await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          businessName,
          slug,
          phone: "00000000000", // Placeholder, to be updated in onboarding
          email,
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        },
      });

      await tx.user.create({
        data: {
          tenantId: tenant.id,
          name,
          email,
          passwordHash,
          role: "owner",
        },
      });
    });

  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  // Redirect to login page with a success flag
  redirect("/login?registered=true");
}