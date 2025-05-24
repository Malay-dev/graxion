import { NextRequest, NextResponse } from "next/server";
import { getAssessmentById, updateAssessment } from "@/lib/data/assessment";

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const assessment = await getAssessmentById(id);

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Error fetching assessment by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  export async function PUT(request: NextRequest) {
    try {
      const body = await request.json();
      const newId = await updateAssessment(body);
      return NextResponse.json(
        { message: "Assessment updated", id: newId },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error updating assessment:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
}
