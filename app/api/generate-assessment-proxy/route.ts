import { NextResponse } from "next/server";

interface GenerateAssessmentRequest {
  title: string;
  subject: string;
  class_: string;
  start_date: string;
  end_date: string;
  question_type: string;
  number_of_questions: number;
  difficulty: string;
  topics: string;
  instructions?: string;
  description?: string;
  max_score: number;
  passing_score: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateAssessmentRequest;

    if (!process.env.NEXT_PUBLIC_SERVER_EVAL_URL) {
      throw new Error("Missing API configuration");
    }

    // Transform the request body if needed (e.g., formatting dates)
    const apiRequestBody = {
      ...body,
      difficulty: body.difficulty.toLowerCase(), // API expects lowercase
    };

    console.log("Sending request to external API:", {
      url: `${process.env.NEXT_PUBLIC_SERVER_EVAL_URL}/generate-qa`,
      body: apiRequestBody,
    });

    // Call the external API to generate questions
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_EVAL_URL}/generate-qa`,
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

    console.log("Generated questions:", generatedQuestions);
    // Transform the response to match your frontend Assessment type if needed
    const transformedResponse = {
      ...body,
      id: generatedQuestions.id || crypto.randomUUID(),
      questions: generatedQuestions.questions || [],
      no_st_attempted: 0,
      no_st_passed: 0,
      submitted: false,
      evaluated: false,
    };

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
