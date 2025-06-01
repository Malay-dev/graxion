import { NextRequest, NextResponse } from "next/server";
import { getAssessmentById, updateAssessment, deleteAssessment } from "@/lib/data/assessment";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await context.params;
    const newId = await updateAssessment(id, body);
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

  
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deleted = await deleteAssessment(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Assessment not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Assessment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

