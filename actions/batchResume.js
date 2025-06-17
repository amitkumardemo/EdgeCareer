import { inngest } from "@/lib/inngest/client";
import { auth } from "@clerk/nextjs/server";

export async function processBatchResumes(files) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await inngest.send({
    name: "resume.parse",
    data: { userId, files },
  });
  return { status: "Batch processing started" };
}
