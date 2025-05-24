import { NextRequest, NextResponse } from "next/server";
import { createQuestion } from "@/lib/data/questions";
import { updateAssessment } from "@/lib/data/assessment";
import { Question } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const assessmentId = body.id;
    const questionsList = body.questions;

    const questions: Question[] = [];
    for (const question of questionsList) {
      const id = await createQuestion(question);
      questions.push({ id, ...question });
    }

    await updateAssessment(assessmentId, { questions: questions });

    console.log("Received question data:", body);
    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
