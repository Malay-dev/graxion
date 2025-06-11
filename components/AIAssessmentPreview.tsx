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
import { Assessment } from "@/types";
import { ChevronLeft } from "lucide-react";

interface AIAssessmentPreviewProps {
  assessmentData: Assessment;
  onSubmit: () => Promise<void>;
  onClose: () => void;
  onBack: () => void;
}

export function AIAssessmentPreview({
  assessmentData,
  onSubmit,
  onClose,
  onBack,
}: AIAssessmentPreviewProps) {
  const formatDate = (dateStr: string | Date) => {
    try {
      const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
      return format(date, "PPP");
    } catch (error) {
      console.log(error);
      return String(dateStr);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generated Assessment</CardTitle>
          <CardDescription>
            Review the AI-generated assessment details
          </CardDescription>
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
                {formatDate(assessmentData.start_date)} -{" "}
                {formatDate(assessmentData.end_date)}
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
              <p className="font-medium text-lg">{assessmentData.max_score}</p>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Passing Score
              </h3>
              <p className="font-medium text-lg">
                {assessmentData.passing_score}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Generated Questions ({assessmentData.questions.length})
          </CardTitle>
          <CardDescription>
            Review AI-generated questions for this assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assessmentData.questions.length === 0 ? (
            <div className="text-center p-4 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                No questions have been generated yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {assessmentData.questions.map((question, index) => (
                <div
                  key={question.id || index}
                  className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Question {index + 1}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{question.type}</span>
                      <span>•</span>
                      <span>{question.answer_type} Answer</span>
                    </div>
                  </div>
                  <p className="mt-2">{question.text}</p>

                  {question.type === "MCQ" &&
                    question.options &&
                    question.options.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium">Answer Choices:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((choice, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm">
                              <div className="h-4 w-4 rounded-full border flex items-center justify-center">
                                {" "}
                                <div className="h-2 w-2 rounded-full bg-muted"></div>
                              </div>
                              {choice.text}
                            </div>
                          ))}
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
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onSubmit}>Create Assessment</Button>
        </div>
      </div>
    </div>
  );
}
