"use client";

import { Calendar, Clock, Save, Send, Share2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PresetShare } from "@/components/PresetShare";

interface AssessmentSidebarProps {
  id: string;
  title: string;
  description: string;
  subject: string;
  startDate: Date;
  endDate: Date;
  questionsAnswered: number;
  totalQuestions: number;
  maxScore: number;
  passingScore: number;
  earnedMarks?: number;
  isSubmitted?: boolean;
  onSubmit?: () => void;
  onSave?: () => void;
  submitDisabled?: boolean;
}

export function AssessmentSidebar({
  id,
  title,
  description,
  subject,
  startDate,
  endDate,
  questionsAnswered,
  totalQuestions,
  maxScore,
  earnedMarks,
  isSubmitted = false,
  onSubmit,
  onSave,
  submitDisabled,
}: AssessmentSidebarProps) {
  const progress = (questionsAnswered / totalQuestions) * 100;
  const formattedStartDate = startDate.toLocaleDateString();
  const formattedEndDate = endDate.toLocaleDateString();

  // Calculate time remaining
  const now = new Date();
  const timeRemaining = endDate.getTime() - now.getTime();
  const daysRemaining = Math.max(
    0,
    Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
  );
  const hoursRemaining = Math.max(
    0,
    Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">ID: {id}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="text-sm text-muted-foreground min-h-10 mb-6">
            {description}
          </p>
          <div className="flex items-center">
            <span className="font-medium mr-1 text-foreground">Subject:</span>
            <span>{subject}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-foreground" />
            <span className="font-medium mr-1 text-foreground">Period:</span>
            <span>
              {formattedStartDate} - {formattedEndDate}
            </span>
          </div>
          {!isSubmitted && timeRemaining > 0 && (
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span className="font-medium mr-1">Time remaining:</span>
              <span>
                {daysRemaining}d {hoursRemaining}h
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span>
              {questionsAnswered} of {totalQuestions} questions
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Total Marks:</span>
            <span className="text-sm font-medium">{maxScore}</span>
          </div>
          {isSubmitted && earnedMarks !== undefined && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Your Score:</span>
              <span className="text-sm font-medium">
                {earnedMarks} ({Math.round((earnedMarks / maxScore) * 100)}%)
              </span>
            </div>
          )}
          {isSubmitted && earnedMarks !== undefined && (
            <div className="mt-4 flex items-center justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Award className="h-8 w-8 text-primary" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {!isSubmitted ? (
          <>
            <Button
              className="w-full"
              onClick={onSubmit}
              disabled={submitDisabled}>
              <Send className="mr-2 h-4 w-4" />
              Submit Assessment
            </Button>
            <Button variant="outline" className="w-full" onClick={onSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Progress
            </Button>
          </>
        ) : (
          <Button className="w-full" variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Report
          </Button>
        )}
        {!isSubmitted && <PresetShare id={id} />}
      </CardFooter>
    </Card>
  );
}
