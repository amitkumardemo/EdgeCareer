import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: roadmapId, stepId } = params;
    const { completed } = await req.json();

    // Verify the roadmap belongs to the user
    const roadmap = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
        user: {
          clerkUserId: userId
        }
      }
    });

    if (!roadmap) {
      return NextResponse.json(
        { error: 'Roadmap not found' },
        { status: 404 }
      );
    }

    // Update the step's completion status
    const updatedStep = await prisma.roadmapStep.update({
      where: {
        id: stepId,
        roadmapId: roadmapId
      },
      data: {
        completed: Boolean(completed)
      }
    });

    return NextResponse.json(updatedStep);
  } catch (error) {
    console.error('Error updating step completion:', error);
    return NextResponse.json(
      { error: 'Failed to update step completion' },
      { status: 500 }
    );
  }
}
