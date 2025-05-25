import { getAllSubmissions, submitAssessment } from '@/lib/data/submission';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const submissions = await getAllSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { assessmentId, studentId, fileUrl } = await req.json();
    await submitAssessment(assessmentId, studentId, fileUrl);
    return NextResponse.json({ message: 'Submission created successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
