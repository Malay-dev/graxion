import { NextRequest, NextResponse } from 'next/server';
import { createQuestion, getAllQuestions } from '@/lib/data/questions';

export async function GET() {
  try {
    const questions = await getAllQuestions();
    return NextResponse.json(questions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = await createQuestion(body);
    return NextResponse.json({ message: 'Created', id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
