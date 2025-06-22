// app/api/roadmap/[id]/milestones/route.js
import { completeTask } from "@/actions/roadmap";
import { auth } from "@clerk/nextjs/server";

export async function POST(req, { params }) {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { taskId } = body;
  if (!taskId) {
    return new Response(JSON.stringify({ error: "taskId required" }), { status: 400 });
  }

  try {
    await completeTask(taskId);
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
