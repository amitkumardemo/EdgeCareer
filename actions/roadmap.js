"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generate a personalised career roadmap and persist it to the database.
 * @param {Object} params
 * @param {string} params.targetRole - Desired career role (e.g. "Frontend Engineer").
 * @param {number} params.durationWeeks - Approx total roadmap duration.
 * @param {string} [params.title] - Optional custom title.
 */
export async function generateRoadmap({ targetRole, durationWeeks = 12, title = "My Career Roadmap" }) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  // Fetch user with resume + skills
  const user = await db.user.findUnique({
    where: { clerkUserId },
    include: {
      resume: true,
    },
  });
  if (!user) throw new Error("User not found");

  const prompt = `You are an expert career coach. Analyse the following profile and generate a structured JSON roadmap.\n\nPROFILE:\nName: ${user.name ?? "Anonymous"}\nIndustry: ${user.industry ?? "N/A"}\nSkills: ${user.skills?.join(", ") ?? "N/A"}\nResume: ${user.resume?.content?.slice(0, 4000) ?? "N/A"}\n\nGOAL: Become a ${targetRole}. The roadmap should span roughly ${durationWeeks} weeks.\n\nReturn ONLY valid JSON in the following schema:\n{\n  \"title\": string,\n  \"milestones\": [\n    {\n      \"title\": string,\n      \"durationWeeks\": number,\n      \"tasks\": [\n        {\n          \"title\": string,\n          \"taskType\": \"learning|project|certification|networking\",\n          \"resourceUrl\": string?,\n          \"estimatedHours\": number?\n        }\n      ]\n    }\n  ]\n}`;

  let roadmapJson;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```(?:json)?/g, "").trim();
    roadmapJson = JSON.parse(text);
  } catch (e) {
    console.error("Failed to generate / parse roadmap JSON", e);
    throw new Error("Gemini generation failed");
  }

  // Persist
  const startDate = new Date();
  const roadmap = await db.roadmap.create({
    data: {
      userId: user.id,
      title: roadmapJson.title || title,
      targetRole,
      startDate,
      milestones: {
        create: roadmapJson.milestones.map((m, idx) => ({
          sequence: idx + 1,
          title: m.title,
          description: m.description ?? null,
          dueDate: (() => {
            try {
              const weeks = m.durationWeeks ?? 2;
              const d = new Date(startDate);
              d.setDate(d.getDate() + weeks * 7);
              return d;
            } catch {
              return null;
            }
          })(),
          tasks: {
            create: m.tasks.map((t) => ({
              title: t.title,
              taskType: t.taskType,
              resourceUrl: t.resourceUrl ?? null,
              estimatedHours: t.estimatedHours ?? null,
            })),
          },
        })),
      },
    },
    include: {
      milestones: {
        include: {
          tasks: true,
        },
      },
    },
  });

  revalidatePath("/roadmap");
  return roadmap;
}

export async function getRoadmaps() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId } });
  if (!user) throw new Error("User not found");

  return db.roadmap.findMany({
    where: { userId: user.id },
    include: {
      milestones: {
        include: { tasks: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function completeTask(taskId) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  // Make sure task belongs to the user
  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      milestone: {
        include: {
          roadmap: true,
        },
      },
    },
  });
  if (!task || task.milestone.roadmap.userId !== task.milestone.roadmap.userId) {
    throw new Error("Task not found");
  }

  await db.task.update({
    where: { id: taskId },
    data: { completed: true },
  });

  revalidatePath(`/roadmap/${task.milestone.roadmapId}`);
}

export async function deleteRoadmap(roadmapId) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId } });
  if (!user) throw new Error("User not found");

  // Ensure roadmap belongs to user
  const roadmap = await db.roadmap.findUnique({ where: { id: roadmapId } });
  if (!roadmap || roadmap.userId !== user.id) {
    throw new Error("Not found");
  }

  // delete child tasks & milestones first due to FK constraints
  await db.task.deleteMany({ where: { milestone: { roadmapId } } });
  await db.milestone.deleteMany({ where: { roadmapId } });

  await db.roadmap.delete({ where: { id: roadmapId } });
  revalidatePath("/roadmap");
}
