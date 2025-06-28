import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, topic, description, steps } = await req.json();

    // Basic validation
    if (!title || !topic || !steps || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json(
        { error: 'Title, topic, and at least one step are required' },
        { status: 400 }
      );
    }

    // Get the user's ID from Clerk
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create the roadmap with its steps in a transaction
    const roadmap = await prisma.$transaction(async (prisma) => {
      const newRoadmap = await prisma.roadmap.create({
        data: {
          userId: user.id,
          title,
          topic,
          description,
        },
      });

      // Create steps for the roadmap
      const roadmapSteps = await Promise.all(
        steps.map((step, index) =>
          prisma.roadmapStep.create({
            data: {
              roadmapId: newRoadmap.id,
              title: step.title,
              description: step.description,
              order: index + 1,
              estimatedTime: step.estimated_time,
            },
          })
        )
      );

      return {
        ...newRoadmap,
        steps: roadmapSteps,
      };
    });

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error('Error saving roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to save roadmap' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Get the user's authentication info
    const { userId } = getAuth(req);
    
    if (!userId) {
      console.error('No user ID found in request');
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to view saved roadmaps' },
        { status: 401 }
      );
    }

    console.log('Fetching roadmaps for user:', userId);
    
    // Get the user's ID from Clerk
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true }
    });

    if (!user) {
      console.error('User not found in database for Clerk ID:', userId);
      return NextResponse.json(
        { error: 'User account not found' },
        { status: 404 }
      );
    }

    console.log('Found user in database with ID:', user.id);
    
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId: user.id },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`Found ${roadmaps.length} roadmaps for user ${user.id}`);
    return NextResponse.json(roadmaps);
    
  } catch (error) {
    console.error('Error in GET /api/roadmaps:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch roadmaps',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
