import { NextResponse } from "next/server";

interface GenerateQuestionsRequest {
  title?: string;
  description?: string;
  subject: string;
  subtopic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  questionType: "MCQ" | "SHORT_ANSWER" | "LONG_ANSWER";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateQuestionsRequest;

    if (!process.env.NEXT_PUBLIC_SERVER_EVAL_URL) {
      throw new Error("Missing API configuration");
    } // Log the request payload for debugging
    console.log("Sending request to external API:", {
      url: `${process.env.NEXT_PUBLIC_SERVER_EVAL_URL}/generate-alternatives`,
      body,
    });

    // Call the external API to generate questions
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_EVAL_URL}/generate-alternatives`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("External API error details:", errorData);
      throw new Error(`External API returned ${response.status}: ${errorData}`);
    }

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    const generatedQuestions = await response.json();

    return NextResponse.json(generatedQuestions);
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
