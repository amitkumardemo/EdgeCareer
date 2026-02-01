"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard"; // Ensure this path is correct

export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    try {
        // Start a transaction for atomicity
        const result = await db.$transaction(
            async (tx) => {
                let industryInsight = await tx.industryInsight.findUnique({
                    where: { industry: data.industry },
                });

                // If industry insight does not exist, or if it is stale, generate and upsert it
                const isStale = industryInsight && industryInsight.nextUpdate < new Date();

                if (!industryInsight || isStale) {
                    // 1. Generate AI insights (where the previous error occurred)
                    const insights = await generateAIInsights(data.industry);

                    // 2. Upsert the IndustryInsight record
                    industryInsight = await tx.industryInsight.upsert({
                        where: { industry: data.industry },
                        update: {
                            ...insights,
                            nextUpdate: new Date(Date.now() + sevenDaysInMs),
                        },
                        create: {
                            industry: data.industry,
                            ...insights,
                            nextUpdate: new Date(Date.now() + sevenDaysInMs),
                        },
                    });
                }

                // 3. Update the user profile
                const updatedUser = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills,
                    },
                });

                return { updatedUser, industryInsight };
            },
            {
                timeout: 15000, // Increased timeout for the transaction to handle the AI call
            }
        );

        revalidatePath("/dashboard"); // Revalidate the dashboard path
        revalidatePath("/onboarding");
        return result.updatedUser;
    } catch (error) {
        // If the error is from generateAIInsights, it will be caught here
        console.error("Error updating user and industry:", error.message);
        throw new Error("Failed to update profile. Details: " + error.message);
    }
}

export async function getUserOnboardingStatus() {
    // ... (This function remains unchanged and is already robust)
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            select: { industry: true },
        });

        return {
            isOnboarded: !!user?.industry,
        };
    } catch (error) {
        console.error("Error checking onboarding status:", error);
        throw new Error("Failed to check onboarding status");
    }
}