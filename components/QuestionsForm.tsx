"use client";

import type React from "react";
import Image from "next/image";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { PlusCircle, Trash2, Edit, Save, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImagesSquare } from "@phosphor-icons/react/dist/ssr";

import { Question } from "@/types";

const questionSchema = z.object({
  type: z.enum(["SHORT_ANSWER", "LONG_ANSWER", "MCQ"], {
    required_error: "Please select a question type",
  }),
  text: z
    .string()
    .min(5, { message: "Question text must be at least 5 characters." }),
  answer_type: z.enum(["Text", "Image"], {
    required_error: "Please select an answer type",
  }),
  options: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
  image_url: z.string().optional(),
});

interface QuestionsFormProps {
  initialQuestions: Question[];
  onSubmit: (questions: Question[]) => void;
  onSaveProgress: () => void;
}

export function QuestionsForm({
  initialQuestions,
  onSubmit,
  onSaveProgress,
}: QuestionsFormProps) {
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions || []
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [optionInputs, setOptionInputs] = useState<
    { id: string; text: string }[]
  >([
    { id: "0", text: "" },
    { id: "1", text: "" },
    { id: "2", text: "" },
    { id: "3", text: "" },
  ]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      type: "SHORT_ANSWER",
      text: "",
      answer_type: "Text",
      options: [],
      image_url: "",
    },
  });

  const questionType = form.watch("type");
  const answer_type = form.watch("answer_type");

  const handleAddQuestion = (values: z.infer<typeof questionSchema>) => {
    const newQuestion: Question = {
      id: editingId || uuidv4(),
      type: values.type,
      text: values.text,
      answer_type: values.answer_type,
      options: values.type === "MCQ" ? [...optionInputs] : undefined,
      image_url: imagePreview || undefined,
      expected_answer: "",
      marks: 1,
    };

    if (editingId) {
      setQuestions(
        questions.map((q) => (q.id === editingId ? newQuestion : q))
      );
      setEditingId(null);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    form.reset({
      type: "SHORT_ANSWER",
      text: "",
      answer_type: "Text",
      options: [],
      image_url: "",
    });
    setOptionInputs([
      { id: "0", text: "" },
      { id: "1", text: "" },
      { id: "2", text: "" },
      { id: "3", text: "" },
    ]);
    setImagePreview(null);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingId(question.id);
    form.reset({
      type: question.type,
      text: question.text,
      answer_type: question.answer_type,
      options: question.options || [],
      image_url: question.image_url,
    });
    setOptionInputs(question.options || []);
    setImagePreview(question.image_url || null);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    if (editingId === id) {
      setEditingId(null);
      form.reset({
        type: "SHORT_ANSWER",
        text: "",
        answer_type: "Text",
        options: [],
        image_url: "",
      });
      setOptionInputs([
        { id: "0", text: "" },
        { id: "1", text: "" },
        { id: "2", text: "" },
        { id: "3", text: "" },
      ]);
      setImagePreview(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset({
      type: "SHORT_ANSWER",
      text: "",
      answer_type: "Text",
      options: [],
      image_url: "",
    });
    setOptionInputs([
      { id: "0", text: "" },
      { id: "1", text: "" },
      { id: "2", text: "" },
      { id: "3", text: "" },
    ]);
    setImagePreview(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...optionInputs];
    newOptions[index].text = value;
    setOptionInputs(newOptions);
    // Update the form field value
    form.setValue(
      "options",
      newOptions.filter((c) => c.text.trim() !== ""),
      { shouldValidate: true }
    );
  };

  const handleAddOption = () => {
    const newOptions = [...optionInputs, { id: uuidv4(), text: "" }];
    setOptionInputs(newOptions);
    // Update the form field value
    form.setValue(
      "options",
      newOptions.filter((c) => c.text.trim() !== ""),
      { shouldValidate: true }
    );
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...optionInputs];
    newOptions.splice(index, 1);
    setOptionInputs(newOptions);
    // Update the form field value
    form.setValue(
      "options",
      newOptions.filter((c) => c.text.trim() !== ""),
      { shouldValidate: true }
    );
  };

  const handleSubmit = () => {
    onSubmit(questions);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("image_url", result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form
          id="question-form"
          onSubmit={form.handleSubmit(handleAddQuestion)}
          className="space-y-6 border rounded-lg p-6">
          <h3 className="text-lg font-medium">
            {editingId ? "Edit Question" : "Add New Question"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
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
                      <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                      <SelectItem value="LONG_ANSWER">Long Answer</SelectItem>
                      <SelectItem value="MCQ">Multiple Choice (MCQ)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select answer type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Text">Text</SelectItem>
                      <SelectItem value="Image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Text</FormLabel>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[
                      { symbol: "π", label: "Pi" },
                      { symbol: "√", label: "Square Root" },
                      { symbol: "∑", label: "Summation" },
                      { symbol: "∫", label: "Integral" },
                      { symbol: "±", label: "Plus-Minus" },
                      { symbol: "∞", label: "Infinity" },
                      { symbol: "θ", label: "Theta" },
                      { symbol: "Δ", label: "Delta" },
                    ].map((item) => (
                      <TooltipProvider key={item.symbol}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const textarea = document.getElementById(
                                  "question-text"
                                ) as HTMLTextAreaElement;
                                if (textarea) {
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const text = field.value;
                                  const newText =
                                    text.substring(0, start) +
                                    item.symbol +
                                    text.substring(end);
                                  field.onChange(newText);

                                  // Set cursor position after the inserted symbol
                                  setTimeout(() => {
                                    textarea.focus();
                                    textarea.setSelectionRange(
                                      start + item.symbol.length,
                                      start + item.symbol.length
                                    );
                                  }, 0);
                                }
                              }}>
                              {item.symbol}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                  <FormControl>
                    <Textarea
                      id="question-text"
                      placeholder="Enter your question here (you can use math symbols from the toolbar above)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {questionType === "MCQ" && (
            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Answer Options</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddOption}
                      className="flex items-center gap-1">
                      <PlusCircle className="h-4 w-4" /> Add Choice
                    </Button>
                  </div>

                  <FormControl>
                    <div className="space-y-2">
                      {optionInputs.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option.text}
                            onChange={(e) => {
                              handleOptionChange(index, e.target.value);
                              // Update the form field value
                              const newOptions = [...optionInputs];
                              newOptions[index].text = e.target.value;
                              field.onChange(
                                newOptions.filter((c) => c.text.trim() !== "")
                              );
                            }}
                            placeholder={`Choice ${index + 1}`}
                            className="flex-1"
                          />
                          {optionInputs.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                handleRemoveOption(index);
                                // Update the form field value after removing a choice
                                const newOptions = [...optionInputs];
                                newOptions.splice(index, 1);
                                field.onChange(
                                  newOptions.filter((c) => c.text.trim() !== "")
                                );
                              }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {answer_type === "Image" && (
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>Image Upload</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      {imagePreview ? (
                        <div className="space-y-4 w-full">
                          <div className="relative aspect-video w-full max-h-[200px] overflow-hidden rounded-lg">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div className="flex justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={triggerFileInput}>
                              Change Image
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setImagePreview(null);
                                field.onChange("");
                              }}>
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ImagesSquare className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drag and drop an image, or click to browse
                          </p>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={triggerFileInput}
                            className="mt-2">
                            <Upload className="h-4 w-4 mr-2" /> Upload Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-end gap-2">
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {editingId ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            Questions ({questions.length})
          </h3>
          <Button
            variant="outline"
            onClick={onSaveProgress}
            className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Progress
          </Button>
        </div>

        {questions.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">
              No questions added yet. Add your first question above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        Question {index + 1}
                      </CardTitle>
                      <CardDescription>
                        {question.type} • {question.answer_type} Answer
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditQuestion(question)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteQuestion(question.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{question.text}</p>

                  {question.type === "MCQ" &&
                    question.options &&
                    question.options.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Options:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm">
                              <div className="h-4 w-4 rounded-full border flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-muted"></div>
                              </div>
                              {option.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {question.answer_type === "Image" && question.image_url && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Image Answer Required:
                      </p>
                      <div className="relative aspect-video w-full max-h-[150px] overflow-hidden rounded-lg bg-muted/50">
                        <Image
                          src={question.image_url || "/placeholder.svg"}
                          alt="Answer image"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <form
        id="questions-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
        <input type="hidden" />
      </form>
    </div>
  );
}
