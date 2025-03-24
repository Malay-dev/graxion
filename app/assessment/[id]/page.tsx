"use client";
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

import { AssessmentSidebar } from "@/components/AssessmentSidebar";
import { MultipleChoiceQuestion } from "@/components/MultipleChoiceQuestion";
import { ShortAnswerQuestion } from "@/components/ShortAnswerQuestion";
import { LongAnswerQuestion } from "@/components/LongAnswerQuestion";
import {
  XCircle,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";

const mockAssessment = {
  id: "ASM-2023-WD-001",
  title: "Introduction to Web Development",
  description:
    "A comprehensive assessment covering the fundamentals of web development, including HTML, CSS, and JavaScript.",
  start_date: "2023-06-01",
  end_date: "2023-06-30",
  max_score: 50,
  passing_score: 30,
  subject: "Web Development",
  questions: [
    {
      id: "q1",
      type: "mcq",
      question: "Which of the following is a frontend JavaScript framework?",
      options: [
        { id: "a", text: "Express.js" },
        { id: "b", text: "Django" },
        { id: "c", text: "React" },
        { id: "d", text: "Flask" },
      ],
      correctAnswer: "c",
      marks: 5,
      imageTypeAnswer: false,
      resources: {
        videos: [
          {
            title: "React JS Crash Course",
            url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
          },
          {
            title: "Frontend Frameworks Explained",
            url: "https://www.youtube.com/watch?v=8pDqJVdNa44",
          },
          {
            title: "JavaScript Frameworks Comparison",
            url: "https://www.youtube.com/watch?v=cuHDQhDhvPE",
          },
        ],
        articles: [
          {
            title: "Introduction to React",
            url: "https://reactjs.org/tutorial/tutorial.html",
          },
          {
            title: "Frontend Frameworks in 2023",
            url: "https://www.freecodecamp.org/news/frontend-frameworks-2023/",
          },
        ],
      },
    },
    {
      id: "q2",
      type: "mcq",
      question: "Which HTML tag is used to create a hyperlink?",
      options: [
        { id: "a", text: "<link>" },
        { id: "b", text: "<a>" },
        { id: "c", text: "<href>" },
        { id: "d", text: "<url>" },
      ],
      correctAnswer: "b",
      marks: 5,
      imageTypeAnswer: false,
      resources: {
        videos: [
          {
            title: "HTML Basics - Links and Anchors",
            url: "https://www.youtube.com/watch?v=DiSvq5SgLMI",
          },
          {
            title: "HTML Tutorial for Beginners",
            url: "https://www.youtube.com/watch?v=qz0aGYrrlhU",
          },
        ],
        articles: [
          {
            title: "HTML Links",
            url: "https://www.w3schools.com/html/html_links.asp",
          },
          {
            title: "The Anchor Element",
            url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a",
          },
        ],
      },
    },
    {
      id: "q3",
      type: "short",
      question: "What does CSS stand for?",
      correctAnswer: "Cascading Style Sheets",
      marks: 10,
      imageTypeAnswer: true,
      resources: {
        videos: [
          {
            title: "CSS Crash Course For Absolute Beginners",
            url: "https://www.youtube.com/watch?v=yfoY53QXEnI",
          },
          {
            title: "CSS Explained in 5 Minutes",
            url: "https://www.youtube.com/watch?v=1PnVor36_40",
          },
        ],
        articles: [
          {
            title: "CSS: Cascading Style Sheets",
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
          },
          { title: "Learn CSS", url: "https://web.dev/learn/css/" },
        ],
      },
    },
    {
      id: "q4",
      type: "long",
      question:
        "Explain the difference between synchronous and asynchronous JavaScript with examples.",
      correctAnswer:
        "Synchronous JavaScript operations block execution until completed, while asynchronous operations allow the program to continue running while waiting for a result. Example of synchronous: console.log() statements execute in order. Example of asynchronous: fetch() API which returns a Promise that resolves when the network request completes.",
      marks: 15,
      imageTypeAnswer: false,
      resources: {
        videos: [
          {
            title: "Async JS Crash Course - Callbacks, Promises, Async Await",
            url: "https://www.youtube.com/watch?v=PoRJizFvM7s",
          },
          {
            title: "JavaScript Promises In 10 Minutes",
            url: "https://www.youtube.com/watch?v=DHvZLI7Db8E",
          },
        ],
        articles: [
          {
            title: "Asynchronous JavaScript",
            url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous",
          },
          {
            title: "Understanding Async/Await",
            url: "https://javascript.info/async-await",
          },
        ],
      },
    },
    {
      id: "q5",
      type: "short",
      question:
        "What is the purpose of the 'viewport' meta tag in responsive web design?",
      correctAnswer:
        "The viewport meta tag controls how a webAssessment is displayed on mobile devices. It sets the width of the viewport to the device width and initial scale, enabling responsive design.",
      marks: 15,
      imageTypeAnswer: true,
      resources: {
        videos: [
          {
            title: "Responsive Web Design Tutorial",
            url: "https://www.youtube.com/watch?v=srvUrASNj0s",
          },
          {
            title: "CSS Media Queries Tutorial",
            url: "https://www.youtube.com/watch?v=2KL-z9A56SQ",
          },
        ],
        articles: [
          {
            title: "Responsive Web Design Basics",
            url: "https://web.dev/responsive-web-design-basics/",
          },
          {
            title: "Using the viewport meta tag",
            url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag",
          },
        ],
      },
    },
  ],
};

const Assessment = () => {
  const [answers, setAnswers] = useState<
    Record<string, { text?: string; image?: string }>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [earnedMarks, setEarnedMarks] = useState<number | undefined>(undefined);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<
    Record<string, boolean>
  >({});
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [correctness, setCorrectness] = useState<Record<string, boolean>>({});
  // Check if all questions are answered
  useEffect(() => {
    const allAnswered = mockAssessment.questions.every(
      (question) => completionStatus[question.id] === true
    );
    setAllQuestionsAnswered(allAnswered);
  }, [completionStatus]);

  const handleAnswerChange = (
    questionId: string,
    answer: string | { text?: string; image?: string }
  ) => {
    // Handle both string answers and object answers with text/image
    const answerObj = typeof answer === "string" ? { text: answer } : answer;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ...answerObj,
      },
    }));

    // Update completion status
    setCompletionStatus((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleImageUpload = (questionId: string, imageUrl: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        image: imageUrl,
      },
    }));

    // Update completion status if this is the first answer for this question
    if (!completionStatus[questionId]) {
      setCompletionStatus((prev) => ({
        ...prev,
        [questionId]: true,
      }));
    }
  };

  const calculateEarnedMarks = () => {
    let marks = 0;
    const correctness: Record<string, boolean> = {};

    mockAssessment.questions.forEach((question) => {
      const userAnswer = answers[question.id];

      if (!userAnswer) return;

      if (
        question.type === "mcq" &&
        userAnswer.text === question.correctAnswer
      ) {
        marks += question.marks;
        correctness[question.id] = true;
      } else if (
        question.type === "short" &&
        userAnswer.text &&
        userAnswer.text.toLowerCase().trim() ===
          question.correctAnswer.toLowerCase().trim()
      ) {
        marks += question.marks;
        correctness[question.id] = true;
      } else if (
        question.type === "long" &&
        userAnswer.text &&
        userAnswer.text.length > 0 &&
        userAnswer.text.length >= question.correctAnswer.length * 0.5
      ) {
        marks += question.marks;
        correctness[question.id] = true;
      } else {
        correctness[question.id] = false;
      }
    });

    return { marks, correctness };
  };

  const handleSubmit = () => {
    const { marks, correctness } = calculateEarnedMarks();
    setEarnedMarks(marks);
    setIsSubmitted(true);
    setShowSubmitDialog(false);
    setCorrectness(correctness);

    toast("Assessment Submitted", {
      description: `You've scored ${marks} out of ${mockAssessment.max_score} marks.`,
    });
  };

  const handleSave = () => {
    toast("Progress Saved", {
      description: "Your progress has been saved successfully.",
    });
  };

  const questionsAnswered = Object.keys(completionStatus).filter(
    (key) => completionStatus[key]
  ).length;

  return (
    <Tabs defaultValue="complete" className="flex-1 px-6">
      <div className="container h-full py-6">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_300px]">
          <div className="hidden flex-col space-y-4 sm:flex md:order-2">
            <AssessmentSidebar
              id={mockAssessment.id}
              title={mockAssessment.title}
              description={mockAssessment.description}
              startDate={new Date(mockAssessment.start_date)}
              endDate={new Date(mockAssessment.end_date)}
              maxScore={mockAssessment.max_score}
              passingScore={mockAssessment.passing_score}
              subject={mockAssessment.subject}
              questionsAnswered={questionsAnswered}
              totalQuestions={mockAssessment.questions.length}
              earnedMarks={earnedMarks}
              isSubmitted={isSubmitted}
              onSubmit={() => setShowSubmitDialog(true)}
              onSave={handleSave}
              submitDisabled={!allQuestionsAnswered}
            />
          </div>
          <div className="md:order-1">
            <TabsContent value="complete" className="mt-0 border-0 p-0">
              <div className="flex h-full flex-col space-y-4 relative">
                {/* Fixed height container with overflow handling */}
                <div className="min-h-[400px] max-h-[400px] flex-1 bg-accent p-4 md:min-h-[500px] md:max-h-[500px] lg:min-h-[645px] lg:max-h-[645px] overflow-y-auto">
                  {/* Even if this is h-screen, it will be contained within the parent */}
                  <div className="h-screen">
                    {mockAssessment.questions.map((question, index) => {
                      const isAnswered = completionStatus[question.id] === true;
                      const isCorrect =
                        completionStatus[question.id] === true &&
                        correctness[question.id] == true; //
                      return (
                        <div key={question.id} className="mb-8">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground font-medium mr-2">
                              {index + 1}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {isAnswered ? (
                                isSubmitted ? (
                                  isCorrect ? (
                                    <span className="flex items-center text-green-600">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Correct Answer
                                    </span>
                                  ) : (
                                    <span className="flex items-center text-red-600">
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Wrong Answer
                                    </span>
                                  )
                                ) : (
                                  <span className="flex items-center text-green-600">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Answered
                                  </span>
                                )
                              ) : (
                                <span className="flex items-center text-amber-600">
                                  <WarningCircle className="h-4 w-4 mr-1" />
                                  Not answered
                                </span>
                              )}
                            </div>
                          </div>

                          {question.type === "mcq" && (
                            <MultipleChoiceQuestion
                              id={question.id}
                              question={question.question}
                              options={question.options || []}
                              marks={question.marks}
                              correctAnswer={question.correctAnswer}
                              isSubmitted={isSubmitted}
                              showCorrectAnswer={isSubmitted}
                              onAnswerChange={(answer) =>
                                handleAnswerChange(question.id, answer)
                              }
                              resources={question.resources}
                            />
                          )}

                          {question.type === "short" && (
                            <ShortAnswerQuestion
                              id={question.id}
                              question={question.question}
                              marks={question.marks}
                              correctAnswer={question.correctAnswer}
                              isSubmitted={isSubmitted}
                              showCorrectAnswer={isSubmitted}
                              onAnswerChange={(answer) =>
                                handleAnswerChange(question.id, answer)
                              }
                              onImageUpload={(imageUrl) =>
                                handleImageUpload(question.id, imageUrl)
                              }
                              imageTypeAnswer={question.imageTypeAnswer}
                              resources={question.resources}
                            />
                          )}

                          {question.type === "long" && (
                            <LongAnswerQuestion
                              id={question.id}
                              question={question.question}
                              marks={question.marks}
                              correctAnswer={question.correctAnswer}
                              isSubmitted={isSubmitted}
                              showCorrectAnswer={isSubmitted}
                              onAnswerChange={(answer) =>
                                handleAnswerChange(question.id, answer)
                              }
                              onImageUpload={(imageUrl) =>
                                handleImageUpload(question.id, imageUrl)
                              }
                              imageTypeAnswer={question.imageTypeAnswer}
                              resources={question.resources}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Or any other large content */}
                </div>
                <AlertDialog
                  open={showSubmitDialog}
                  onOpenChange={setShowSubmitDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit Assessment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to submit your assessment? You
                        have answered {questionsAnswered} out of{" "}
                        {mockAssessment.questions.length} questions.
                        {questionsAnswered <
                          mockAssessment.questions.length && (
                          <p className="mt-2 text-amber-500 font-medium">
                            Warning: You have{" "}
                            {mockAssessment.questions.length -
                              questionsAnswered}{" "}
                            unanswered questions.
                          </p>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>
                        Submit
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </Tabs>
  );
};

export default Assessment;
