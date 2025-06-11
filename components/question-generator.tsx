"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, RefreshCw, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Question } from "@/types";

const formSchema = z.object({
  subtopic: z
    .string()
    .min(2, { message: "Subtopic must be at least 2 characters." }),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    required_error: "Please select a difficulty level",
  }),
  marks: z.coerce
    .number()
    .min(1, { message: "Marks must be at least 1." })
    .max(100, { message: "Marks cannot exceed 100." }),
  questionType: z.enum(["MCQ", "SHORT_ANSWER", "LONG_ANSWER"], {
    required_error: "Please select a question type",
  }),
});

interface QuestionGeneratorProps {
  onAddQuestion: (question: Question) => void;
  subject: string;
  assessmentDetails?: {
    id?: string;
    title?: string;
    description?: string;
    duration?: number;
    totalMarks?: number;
    passingPercentage?: number;
  };
}

interface GenerateQuestionsRequest {
  id?: string;
  title?: string;
  description?: string;
  subject: string;
  subtopic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  questionType: "MCQ" | "SHORT_ANSWER" | "LONG_ANSWER";
}

export function QuestionGenerator({
  onAddQuestion,
  subject,
  assessmentDetails = {},
}: QuestionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subtopic: "",
      difficulty: "Medium",
      marks: 5,
      questionType: "MCQ" as const,
    },
  });

  const generateQuestions = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    setGeneratedQuestions([]);
    setSelectedQuestionIndex(null);
    setFeedbackGiven(false);

    try {
      const requestBody: GenerateQuestionsRequest = {
        id: assessmentDetails.id || uuidv4(),
        title: assessmentDetails.title,
        description: assessmentDetails.description,
        subject,
        subtopic: values.subtopic,
        difficulty: values.difficulty,
        marks: values.marks,
        questionType: values.questionType,
      };
      console.log("Request Body:", requestBody);
      const response = await fetch("/api/generate-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format from API");
      }

      // Assign new UUIDs to each question
      const questionsWithNewIds = data.map((question) => ({
        ...question,
        id: uuidv4(),
      }));

      console.log("Generated Questions with new IDs:", questionsWithNewIds);
      setGeneratedQuestions(questionsWithNewIds);
    } catch (error) {
      console.error("Error generating questions:", error);
      // Here you could add a toast notification for error feedback
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSelectedQuestion = () => {
    console.log("Adding selected question...");
    if (
      selectedQuestionIndex !== null &&
      generatedQuestions[selectedQuestionIndex]
    ) {
      const selectedQuestion = generatedQuestions[selectedQuestionIndex];
      console.log("Selected Question:", selectedQuestion);
      onAddQuestion(selectedQuestion);
      setGeneratedQuestions([]);
      setSelectedQuestionIndex(null);
      form.reset();
    }
  };

  const handleRegenerateQuestions = () => {
    const values = form.getValues();
    generateQuestions(values as z.infer<typeof formSchema>);
  };

  const giveFeedback = (positive: boolean) => {
    // In a real application, this would send feedback to improve the AI model
    console.log(
      `User gave ${
        positive ? "positive" : "negative"
      } feedback on generated questions`
    );
    setFeedbackGiven(true);
  };

  return (
    <div className="space-y-8">
      <div className="bg-muted/30 border rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">AI Question Generator</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(generateQuestions)}
            className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subtopic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtopic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter subtopic (e.g., Photosynthesis)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Specify the subtopic for which questions should be
                      generated
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="questionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {" "}
                        <SelectItem value="MCQ">
                          Multiple Choice (MCQ)
                        </SelectItem>
                        <SelectItem value="SHORT_ANSWER">
                          Short Answer
                        </SelectItem>
                        <SelectItem value="LONG_ANSWER">Long Answer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marks</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={100} {...field} />
                    </FormControl>
                    <FormDescription>
                      Assign marks value for this question
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                "Generate Questions"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {generatedQuestions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Generated Questions</h3>
            <div className="flex items-center gap-2">
              {!feedbackGiven && (
                <>
                  <p className="text-sm text-muted-foreground mr-2">
                    Was this helpful?
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => giveFeedback(true)}
                    className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => giveFeedback(false)}
                    className="flex items-center gap-1">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateQuestions}
                className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
            </div>
          </div>

          <RadioGroup
            value={
              selectedQuestionIndex !== null
                ? selectedQuestionIndex.toString()
                : undefined
            }
            onValueChange={(value) =>
              setSelectedQuestionIndex(Number.parseInt(value))
            }
            className="space-y-4">
            {generatedQuestions.map((question, index) => (
              <div
                key={question.id}
                className={`border rounded-lg p-4 transition-colors ${
                  selectedQuestionIndex === index
                    ? "border-primary bg-primary/5"
                    : "hover:border-muted-foreground/20"
                }`}>
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`question-${index}`}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`question-${index}`}
                      className="text-base font-medium cursor-pointer">
                      {question.text}
                    </Label>

                    {question.type === "MCQ" && question.options && (
                      <div className="mt-3 ml-6 space-y-2">
                        {question.options.map((choice, choiceIndex) => (
                          <div
                            key={choiceIndex}
                            className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-muted"></div>
                            </div>
                            <span className="text-sm">{choice.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          <Button
            onClick={handleAddSelectedQuestion}
            disabled={selectedQuestionIndex === null}
            className="w-full">
            <Check className="mr-2 h-4 w-4" />
            Add Selected Question to Assessment
          </Button>
        </div>
      )}
    </div>
  );
}
