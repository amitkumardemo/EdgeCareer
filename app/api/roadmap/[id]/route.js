// app/api/roadmap/[id]/route.js
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(_, { params }) {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const roadmap = await db.roadmap.findUnique({
    where: { id: params.id },
    include: {
      milestones: {
        include: { tasks: true },
        orderBy: { sequence: "asc" },
      },
    },
  });

  if (!roadmap) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }

  return Response.json(roadmap);
}
