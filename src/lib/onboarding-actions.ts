"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function completeOnboardingAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const phone = formData.get("phone") as string;
  const service1 = formData.get("service1") as string;
  const service2 = formData.get("service2") as string;
  const service3 = formData.get("service3") as string;

  // Filter out empty services
  const servicesToCreate = [service1, service2, service3]
    .filter((s) => s && s.trim() !== "")
    .map((name) => ({
      tenantId: session.user.tenantId,
      name,
      duration: 60,
    }));

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update the Tenant's phone number
      await tx.tenant.update({
        where: { id: session.user.tenantId },
        data: { phone },
      });

      // 2. Create the services
      await tx.service.createMany({
        data: servicesToCreate,
      });
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    throw new Error("Failed to save onboarding details");
  }

  redirect("/app");
}