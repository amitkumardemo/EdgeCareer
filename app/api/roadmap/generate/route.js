// app/api/roadmap/generate/route.js
import { generateRoadmap } from "@/actions/roadmap";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
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

  const { targetRole, durationWeeks, title } = body;
  if (!targetRole) {
    return new Response(JSON.stringify({ error: "targetRole is required" }), { status: 400 });
  }

  try {
    const roadmap = await generateRoadmap({ targetRole, durationWeeks, title });
    return new Response(JSON.stringify(roadmap), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
