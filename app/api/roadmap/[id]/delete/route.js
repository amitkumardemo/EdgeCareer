// app/api/roadmap/[id]/delete/route.js
import { deleteRoadmap } from "@/actions/roadmap";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(_, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await deleteRoadmap(params.id);
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
