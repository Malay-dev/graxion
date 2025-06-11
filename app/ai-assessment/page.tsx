"use client";

import { AIAssessmentGeneratorForm } from "@/components/AIAssessmentGeneratorForm";

interface AIAssessmentFormData {
  title: string;
  subject: string;
  class: string;
  start_date: Date;
  end_date: Date;
  question_type: "MCQ" | "Short Answer" | "Descriptive";
  number_of_questions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  max_score: number;
  passing_score: number;
  topics?: string;
  instructions?: string;
  description?: string;
}

export default function AIAssessmentPage() {
  const handleGenerate = async (formData: AIAssessmentFormData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_EVAL_URL}/api/generate-qa`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();
    console.log("AI generated questions:", result);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Assessment Generator</h1>
      <AIAssessmentGeneratorForm onGenerate={handleGenerate} />
    </div>
  );
}
