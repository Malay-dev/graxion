import { NextRequest, NextResponse } from "next/server";
import {
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "@/lib/data/questions";

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const question = await getQuestionById(id);
  return question
    ? NextResponse.json(question)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const { id } = await context.params;
    await updateQuestion(id, data);
    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await deleteQuestion(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
