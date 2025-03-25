"use client";

import { useState } from "react";
import { Check, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ReviewDialog } from "./ReviewDialog";

interface Option {
  id: string;
  text: string;
}

interface MultipleChoiceQuestionProps {
  id: string;
  question: string;
  options: Option[];
  marks: number;
  expected_answer: string;
  showCorrectAnswer?: boolean;
  isSubmitted?: boolean;
  onAnswerChange?: (answerId: string) => void;
  resources?: {
    videos?: { title: string; url: string }[];
    articles?: { title: string; url: string }[];
  };
}

export function MultipleChoiceQuestion({
  id,
  question,
  options,
  marks,
  expected_answer,
  isSubmitted = false,
  onAnswerChange,
  resources,
}: MultipleChoiceQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [reviewOpen, setReviewOpen] = useState(false);

  const isCorrect = isSubmitted && selectedOption === expected_answer;
  const isIncorrect =
    isSubmitted && selectedOption && selectedOption !== expected_answer;

  const handleOptionChange = (value: string) => {
    if (!isSubmitted) {
      setSelectedOption(value);
      if (onAnswerChange) {
        onAnswerChange(value);
      }
    }
  };

  return (
    <>
      <Card
        className={`mb-6 ${
          isCorrect ? "border-green-500" : isIncorrect ? "border-red-500" : ""
        }`}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{question}</h3>
              {isCorrect && <Check className="h-5 w-5 text-green-500" />}
              {isIncorrect && <X className="h-5 w-5 text-red-500" />}
            </div>
            <Badge variant="outline" className="text-xs">
              {marks} {marks === 1 ? "mark" : "marks"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedOption}
            onValueChange={handleOptionChange}
            className="space-y-3"
            disabled={isSubmitted}>
            {options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-2 rounded-md border p-3 ${
                  isSubmitted && expected_answer === option.id
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : isSubmitted &&
                      selectedOption === option.id &&
                      selectedOption !== expected_answer
                    ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                    : ""
                }`}>
                <RadioGroupItem
                  value={option.id}
                  id={`option-${id}-${option.id}`}
                />
                <Label
                  htmlFor={`option-${id}-${option.id}`}
                  className="flex-grow cursor-pointer">
                  {option.text}
                </Label>
                {isSubmitted && expected_answer === option.id && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {isSubmitted &&
                  selectedOption === option.id &&
                  selectedOption !== expected_answer && (
                    <X className="h-4 w-4 text-red-500" />
                  )}    
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        {isIncorrect && (
          <CardFooter className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-primary"
              onClick={() => setReviewOpen(true)}>
              <Play className="h-4 w-4" />
              Review
            </Button>
          </CardFooter>
        )}
      </Card>

      {resources && (
        <ReviewDialog
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          question={question}
          resources={resources}
        />
      )}
    </>
  );
}
