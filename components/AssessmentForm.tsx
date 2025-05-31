"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AssessmentDetailsForm } from "./AssessmentDetailsForm";
import { QuestionsForm } from "./QuestionsForm";
import { AssessmentPreview } from "./AssessmentPreview";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

import { Assessment, Question } from "@/types";

export default function AssessmentFormPopup({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [assessmentData, setAssessmentData] = useState<Assessment>({
    id: "",
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    max_score: 100,
    no_st_attempted: 0,
    no_st_passed: 0,
    passing_score: 60,
    subject: "",
    class: "",
    questions: [],
    submitted: false,
    evaluated: false,
  });

  const handleStage1Submit = async (data: Partial<Assessment>) => {
    const updatedData = { ...assessmentData, ...data };
    setAssessmentData(updatedData);
    console.log("Stage 1 Data:", updatedData);

    try {
      const response = await fetch(`/api/assessments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to save assessment details");
      }
      const result = await response.json();
      console.log("Assessment created with ID:", result.id);
      if (result.id) {
        setAssessmentData((prev) => ({
          ...prev,
          id: result.id,
        }));
      }
      setCurrentStage(2);
    } catch (error) {
      console.error("Error saving assessment details:", error);
      alert("Failed to save assessment details. Please try again.");
    }
  };

  const handleStage2Submit = async (questions: Question[]) => {
    const updatedData = { ...assessmentData, questions };
    setAssessmentData(updatedData);
    console.log("Stage 2 Data:", updatedData);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to save questions");
      }
      const result = await response.json();
      if (result.questions) {
        setAssessmentData((prev) => ({
          ...prev,
          questions: result.questions,
        }));
      }
      setCurrentStage(3);
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("Failed to save questions. Please try again.");
    }
  };

  const handleFinalSubmit = async () => {
    console.log("Final Assessment Data:", assessmentData);

    try {
      const response = await fetch(`/api/assessments/${assessmentData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit assessment");
      }

      setOpen(false);
      setCurrentStage(1);
      // Reset form data if needed
      setAssessmentData({
        id: "",
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        max_score: 100,
        no_st_attempted: 0,
        no_st_passed: 0,
        passing_score: 60,
        subject: "",
        class: "",
        questions: [],
        submitted: false,
        evaluated: false,
      });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Failed to submit assessment. Please try again.");
    }
  };

  const goBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const saveProgress = () => {
    console.log("Saving progress...", assessmentData);
    // In a real application, this would save to localStorage, a database, etc.
    alert("Progress saved successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-[95vw] h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {currentStage === 1 && "Create Assessment - Details"}
            {currentStage === 2 && "Create Assessment - Add Questions"}
            {currentStage === 3 && "Create Assessment - Preview & Submit"}
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center justify-between mt-2 mb-6">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    currentStage >= 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                  1
                </div>
                <div
                  className={`h-1 w-12 ${
                    currentStage >= 2 ? "bg-primary" : "bg-muted"
                  }`}></div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    currentStage >= 2
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                  2
                </div>
                <div
                  className={`h-1 w-12 ${
                    currentStage >= 3 ? "bg-primary" : "bg-muted"
                  }`}></div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    currentStage >= 3
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                  3
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {currentStage === 1 && "Step 1: Enter assessment details"}
                {currentStage === 2 &&
                  "Step 2: Add questions to your assessment"}
                {currentStage === 3 &&
                  "Step 3: Review and submit your assessment"}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 py-2">
          {currentStage === 1 && (
            <AssessmentDetailsForm
              initialData={assessmentData}
              onSubmit={handleStage1Submit}
            />
          )}
          {currentStage === 2 && assessmentData.questions && (
            <QuestionsForm
              initialQuestions={assessmentData.questions}
              onSubmit={handleStage2Submit}
              onSaveProgress={saveProgress}
            />
          )}
          {currentStage === 3 && (
            <AssessmentPreview
              assessmentData={assessmentData}
              onSubmit={handleFinalSubmit}
              onClose={() => setOpen(false)}
              onBack={goBack}
              onSaveProgress={saveProgress}
            />
          )}
        </div>

        {currentStage !== 3 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={currentStage === 1}
              className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>

            {currentStage === 2 && (
              <Button
                variant="outline"
                onClick={saveProgress}
                className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Progress
              </Button>
            )}

            <Button
              type="submit"
              form={
                currentStage === 1
                  ? "assessment-details-form"
                  : "questions-form"
              }
              className="flex items-center gap-2">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
