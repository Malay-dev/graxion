"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import type { AssessmentData } from "./AssessmentForm";
import { ChevronLeft, Save } from "lucide-react";
import Image from "next/image";

interface AssessmentPreviewProps {
  assessmentData: AssessmentData;
  onSubmit: () => void;
  onClose: () => void;
  onBack: () => void;
  onSaveProgress: () => void;
}

export function AssessmentPreview({
  assessmentData,
  onSubmit,
  onClose,
  onBack,
  onSaveProgress,
}: AssessmentPreviewProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
          <CardDescription>Review the assessment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Title
              </h3>
              <p className="font-medium">{assessmentData.title}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Subject
              </h3>
              <p className="font-medium">{assessmentData.subject}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Class
              </h3>
              <p className="font-medium">{assessmentData.class}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Duration
              </h3>
              <p className="font-medium">
                {formatDate(assessmentData.startDate)} -{" "}
                {formatDate(assessmentData.endDate)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Description
            </h3>
            <p className="mt-1">{assessmentData.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Max Score
              </h3>
              <p className="font-medium text-lg">{assessmentData.maxScore}</p>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Passing Score
              </h3>
              <p className="font-medium text-lg">
                {assessmentData.passingScore}
              </p>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Students Attempted
              </h3>
              <p className="font-medium text-lg">
                {assessmentData.studentsAttempted}
              </p>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Students Passed
              </h3>
              <p className="font-medium text-lg">
                {assessmentData.studentsPassed}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions ({assessmentData.questions.length})</CardTitle>
          <CardDescription>
            Review all questions in this assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assessmentData.questions.length === 0 ? (
            <div className="text-center p-4 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                No questions have been added to this assessment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {assessmentData.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Question {index + 1}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{question.type}</span>
                      <span>•</span>
                      <span>{question.answerType} Answer</span>
                    </div>
                  </div>
                  <p className="mt-2">{question.text}</p>

                  {question.type === "MCQ" &&
                    question.choices &&
                    question.choices.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium">Answer Choices:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.choices.map((choice, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm">
                              <div className="h-4 w-4 rounded-full border flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-muted"></div>
                              </div>
                              {choice}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {question.answerType === "Image" && question.imageUrl && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">
                        Image Answer Required:
                      </h4>
                      <div className="mt-2 relative aspect-video w-full max-h-[150px] overflow-hidden rounded-lg bg-muted/50">
                        <Image
                          src={question.imageUrl || "/placeholder.svg"}
                          alt="Answer image"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onSaveProgress}
            className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Progress
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onSubmit}>Create Assessment</Button>
        </div>
      </div>
    </div>
  );
}
