import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { resumeText, jobDescription, userId } = await req.json();
    if (!resumeText || !jobDescription || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Call Python ATS analyzer
    const result = await new Promise((resolve, reject) => {
      const py = spawn('python', [
        './ResumeAnalyzer/ATS_optimization.py',
        resumeText,
        jobDescription
      ]);
      let data = '';
      py.stdout.on('data', (chunk) => { data += chunk; });
      py.stderr.on('data', (err) => { reject(err.toString()); });
      py.on('close', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject('Invalid output from analyzer');
        }
      });
    });

    // Store results in DB
    await prisma.resume.update({
      where: { userId },
      data: {
        atsScore: result.ats_analysis_summary?.missing_keywords_count,
        feedback: result.recommendations?.join('\n'),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}
