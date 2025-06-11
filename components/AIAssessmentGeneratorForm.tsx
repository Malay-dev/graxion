"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Assessment } from "@/types";
import { AIAssessmentPreview } from "./AIAssessmentPreview";
import { v4 as uuidv4 } from "uuid";
import Loading from "./Loading";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const aiAssessmentSchema = z.object({
  title: z.string().min(2),
  subject: z.string(),
  class_: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  question_type: z.enum(["SHORT_ANSWER", "LONG_ANSWER"]),
  number_of_questions: z.coerce.number().min(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  topics: z.string().optional(),
  instructions: z.string().optional(),
  description: z.string().optional(),
  max_score: z.coerce.number().min(1),
  passing_score: z.coerce.number().min(0),
});

type AIAssessmentFormData = z.infer<typeof aiAssessmentSchema>;

interface AIAssessmentGeneratorDialogProps {
  children: React.ReactNode;
}

export function AIAssessmentGeneratorDialog({
  children,
}: AIAssessmentGeneratorDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedAssessment, setGeneratedAssessment] =
    useState<Assessment | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-[95vw] h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {generatedAssessment
              ? "Review Generated Assessment"
              : "Generate Assessment with AI"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1 py-2">
          {isSubmitting ? (
            <Loading text="Saving assessment..." fullScreen={false} />
          ) : generatedAssessment ? (
            <AIAssessmentPreview
              assessmentData={generatedAssessment}
              onSubmit={async () => {
                try {
                  setIsSubmitting(true);
                  const response = await fetch("/api/assessments", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(generatedAssessment),
                  });

                  if (!response.ok) {
                    throw new Error("Failed to save assessment");
                  }

                  setOpen(false);
                  window.location.reload();
                } catch (error) {
                  console.error("Error saving assessment:", error);
                  alert("Failed to save assessment. Please try again.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              onClose={() => setOpen(false)}
              onBack={() => setGeneratedAssessment(null)}
            />
          ) : (
            <AIAssessmentGeneratorForm onGenerated={setGeneratedAssessment} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AIAssessmentGeneratorForm({
  onGenerated,
}: {
  onGenerated: (assessment: Assessment) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm<AIAssessmentFormData>({
    resolver: zodResolver(aiAssessmentSchema),
    defaultValues: {
      title: "",
      subject: "",
      class_: "",
      start_date: new Date(),
      end_date: new Date(),
      question_type: "SHORT_ANSWER",
      number_of_questions: 5,
      difficulty: "Medium",
      topics: "",
      instructions: "",
      description: "",
      max_score: 100,
      passing_score: 40,
    },
  });
  const handleSubmit = async (values: AIAssessmentFormData) => {
    try {
      setIsGenerating(true);
      // Format the data according to API requirements
      const formattedData = {
        ...values,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        difficulty: values.difficulty.toLowerCase(),
      };

      const response = await fetch("/api/generate-assessment-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate assessment");
      }
      const result = (await response.json()) as {
        questions: Array<{ question: string; expected_answer: string }>;
      };

      // Transform the questions to match the required structure
      const transformedQuestions = result.questions.map((q) => ({
        id: uuidv4(),
        type: values.question_type,
        text: q.question,
        answer_type: "Text",
        expected_answer: q.expected_answer,
        marks: Math.floor(values.max_score / result.questions.length),
        options: values.question_type === "SHORT_ANSWER" ? [] : undefined,
      }));

      // Create the final assessment object
      const transformedAssessment = {
        ...values,
        id: uuidv4(),
        class: values.class_, // Map class_ back to class for frontend
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        no_st_attempted: 0,
        no_st_passed: 0,
        submitted: false,
        evaluated: false,
        questions: transformedQuestions,
        description: values.description ?? "", // Ensure description is always a string
      };
      console.log("Generated assessment:", transformedAssessment);

      // Pass the transformed assessment to parent for preview
      onGenerated(transformedAssessment);
    } catch (error) {
      console.error("Error generating assessment:", error);
      alert("Failed to generate assessment. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  if (isGenerating) {
    return (
      <Loading text="Generating assessment questions..." fullScreen={false} />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic details */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assessment Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Maths">Maths</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="class_"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Class 10th A">Class 10th A</SelectItem>
                    <SelectItem value="Class 11th A">Class 11th A</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Dates */}
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full text-left",
                          !field.value && "text-muted-foreground"
                        )}>
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      selected={field.value}
                      onSelect={field.onChange}
                      mode="single"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full text-left",
                          !field.value && "text-muted-foreground"
                        )}>
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      selected={field.value}
                      onSelect={field.onChange}
                      mode="single"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief overview of the assessment"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="max_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Score</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passing_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passing Score</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* AI options */}
          <FormField
            control={form.control}
            name="question_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                    <SelectItem value="LONG_ANSWER">Long Answer</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number_of_questions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of Questions</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {/* Optional fields */}
        <FormField
          control={form.control}
          name="topics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topics or Concepts</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Trigonometry, Newton's Laws"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Avoid repetitive questions, limit to 3 marks each."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full cursor-pointer">
          Generate Assessment with AI
        </Button>
      </form>
    </Form>
  );
}
