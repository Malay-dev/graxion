"use client";

import { AIAssessmentGeneratorForm } from "@/components/AIAssessmentGeneratorForm";

export default function AIAssessmentPage() {
  const handleGenerate = async (formData: any) => {
    const res = await fetch("/api/generate-assessment", {
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
