import { NextRequest, NextResponse } from 'next/server';
import { getQuestionsByAssessmentId } from '@/lib/data/questions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const assessmentId = searchParams.get('assessmentId');
  if (!assessmentId) return NextResponse.json({ error: 'Missing assessmentId' }, { status: 400 });

  try {
    const questions = await getQuestionsByAssessmentId(assessmentId);
    return NextResponse.json(questions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
