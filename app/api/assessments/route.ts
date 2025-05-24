import { NextRequest, NextResponse } from "next/server";
import { getAssessments, addAssessment } from "@/lib/data/assessment";

export async function GET() {
  try {
    const data = await getAssessments();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newId = await addAssessment(body);
    return NextResponse.json(
      { message: "Assessment created", id: newId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating assessment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
