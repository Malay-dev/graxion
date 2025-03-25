"use client";

import type React from "react";

import { useState } from "react";
import { Check, X, Upload, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ReviewDialog } from "./ReviewDialog";
import { cn } from "@/lib/utils";
import { ImageSquare } from "@phosphor-icons/react/dist/ssr";

interface LongAnswerQuestionProps {
  id: string;
  question: string;
  marks: number;
  expected_answer: string;
  showCorrectAnswer?: boolean;
  isSubmitted?: boolean;
  imageTypeAnswer?: boolean;
  onAnswerChange?: (answer: string) => void;
  onImageUpload?: (imageUrl: string) => void;
  resources?: {
    videos?: { title: string; url: string }[];
    articles?: { title: string; url: string }[];
  };
}

export function LongAnswerQuestion({
  id,
  question,
  marks,
  expected_answer,
  isSubmitted = false,
  imageTypeAnswer = false,
  onAnswerChange,
  onImageUpload,
  resources,
}: LongAnswerQuestionProps) {
  const [answer, setAnswer] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [answerType, setAnswerType] = useState<"text" | "image">("text");
  console.log("LongAnswerQuestion : id", id);
  const isCorrect =
    isSubmitted &&
    answer.length > 0 &&
    answer.length >= expected_answer.length * 0.5;
  const isIncorrect = isSubmitted && answer && !isCorrect;

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isSubmitted) {
      setAnswer(e.target.value);
      if (onAnswerChange) {
        onAnswerChange(e.target.value);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSubmitted) {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        setAnswerType("image");

        // Notify parent component about the image upload
        if (onImageUpload) {
          onImageUpload(url);
        }
      }
    }
  };

  const handleSwitchToText = () => {
    setAnswerType("text");
  };

  const handleSwitchToImage = () => {
    setAnswerType("image");
  };

  return (
    <>
      <Card
        className={cn(
          "mb-6 transition-all duration-200",
          isCorrect ? "border-green-500" : isIncorrect ? "border-red-500" : ""
        )}>
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
          {imageTypeAnswer && !isSubmitted && (
            <div className="flex space-x-2 mb-4">
              <Button
                variant={answerType === "text" ? "default" : "outline"}
                size="sm"
                onClick={handleSwitchToText}
                className="flex-1">
                Text Answer
              </Button>
              <Button
                variant={answerType === "image" ? "default" : "outline"}
                size="sm"
                onClick={handleSwitchToImage}
                className="flex-1">
                <ImageSquare className="h-4 w-4 mr-2" />
                Image Answer
              </Button>
            </div>
          )}

          {(answerType === "text" || !imageTypeAnswer) && (
            <Textarea
              placeholder="Type your detailed answer here..."
              value={answer}
              onChange={handleAnswerChange}
              className="min-h-[200px]"
              disabled={isSubmitted || answerType === "image"}
            />
          )}

          {isSubmitted && (
            <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/20">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                Model Answer:
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {expected_answer}
              </p>
            </div>
          )}

          {imageUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Uploaded Image:</p>
              <div className="relative rounded-md border overflow-hidden bg-muted/20">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Uploaded answer"
                  className="max-h-60 w-full object-contain"
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isSubmitted && imageTypeAnswer && answerType === "image" && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <label className="cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </label>
            </Button>
          )}

          {isIncorrect && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-primary ml-auto"
              onClick={() => setReviewOpen(true)}>
              <Play className="h-4 w-4" />
              Review
            </Button>
          )}
        </CardFooter>
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
