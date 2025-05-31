import { submitAssessmentAnswers } from "@/lib/data/submission";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { answers } = body;

  if (!id || !answers) {
    return NextResponse.json(
      { error: "Missing id or answers" },
      { status: 400 }
    );
  }

  try {
    await submitAssessmentAnswers(id, answers);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error submitting assessment answers:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
