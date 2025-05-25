import { getSubmissionById, markAsDone } from '@/lib/data/submission';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const submission = await getSubmissionById(Number(params.id));
    if (!submission) throw new Error('Submission not found');
    return NextResponse.json(submission);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PATCH(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await markAsDone(Number(params.id));
    return NextResponse.json({ message: 'Marked as done' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

