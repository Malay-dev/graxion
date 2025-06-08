"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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
import Loading from "@/components/Loading";
import { saveSwotAnalysis } from "@/lib/data/analysis";

type AssessmentData = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  max_score: number;
  passing_score: number;
  subject: string;
  submitted: boolean;
  evaluated: boolean;
  questions: {
    id: string;
    type: string;
    text: string;
    options?: { id: string; text: string }[];
    expected_answer: string;
    answer?: string;
    marks: number;
    answer_type: string;
    resources?: {
      video?: { title: string; url: string };
      ref_videos?: { title: string; url: string }[];
      ref_articles?: { title: string; url: string }[];
    };
  }[];
  evaluation_results?: {
    question_id: string;
    marks: number;
    is_correct: boolean;
    feedback?: string;
    analysis?: string;
  }[];
};

const Assessment = () => {
  const [answers, setAnswers] = useState<
    Record<string, { text?: string; image?: string }>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [evaluationLoading, setEvaluationLoading] = useState(false);

  const [earnedMarks, setEarnedMarks] = useState<number | undefined>(undefined);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<
    Record<string, boolean>
  >({});
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [correctness, setCorrectness] = useState<Record<string, boolean>>({});
  const [swotData, setSwotData] = useState<object | null>(null);

  const [assessment_data, setAssessment_data] = useState<AssessmentData>();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/assessments/${params?.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setAssessment_data(result);
      console.log(result);
      setIsSubmitted(result.submitted);
      setIsEvaluated(result.evaluated);
      if (result.evaluated && result.evaluation_results) {
        let marks = 0;
        const correctnessMap: Record<string, boolean> = {};
        result.evaluation_results.forEach(
          (item: {
            marks: number;
            question_id: string | number;
            is_correct: boolean;
          }) => {
            marks += item.marks;
            correctnessMap[item.question_id] = item.is_correct;
          }
        );
        setEarnedMarks(marks);
        setCorrectness(correctnessMap);
      }
    };
    fetchData();
  }, [params?.id]);

  useEffect(() => {
    if (assessment_data) {
      const allAnswered = assessment_data.questions.every(
        (question) => completionStatus[question.id] === true
      );
      setAllQuestionsAnswered(allAnswered);
    }
  }, [completionStatus, assessment_data]);

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

  // const calculateEarnedMarks = () => {
  //   let marks = 0;
  //   const correctness: Record<string, boolean> = {};

  //   assessment_data?.questions.forEach((question) => {
  //     const userAnswer = answers[question.id];

  //     if (!userAnswer) return;

  //     if (
  //       question.type === "MCQ" &&
  //       userAnswer.text === question.expected_answer
  //     ) {
  //       marks += question.marks;
  //       correctness[question.id] = true;
  //     } else if (
  //       question.type === "SHORT_ANSWER" &&
  //       userAnswer.text &&
  //       userAnswer.text.toLowerCase().trim() ===
  //         question.expected_answer.toLowerCase().trim()
  //     ) {
  //       marks += question.marks;
  //       correctness[question.id] = true;
  //     } else if (
  //       question.type === "LONG_ANSWER" &&
  //       userAnswer.text &&
  //       userAnswer.text.length > 0 &&
  //       userAnswer.text.length >= question.expected_answer.length * 0.5
  //     ) {
  //       marks += question.marks;
  //       correctness[question.id] = true;
  //     } else {
  //       correctness[question.id] = false;
  //     }
  //   });

  //   return { marks, correctness };
  // };

  const handleSubmit = async () => {
    await fetch(`/api/submit/${params?.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    setIsSubmitted(true);
    toast("Assessment Submitted", {
      description: "Submission saved. Awaiting evaluation.",
    });
  };

  const handleSave = () => {
    toast("Progress Saved", {
      description: "Your progress has been saved successfully.",
    });
  };
  const getEvaluationResults = async () => {
    if (!assessment_data) return;
    // Build the request body as required by the API
    const items = assessment_data.questions.map((q) => ({
      question_id: q.id,
      question: q.text,
      actual_answer: answers[q.id]?.text || "",
      expected_answer: q.expected_answer,
    }));
    const response = await fetch("/api/eval-proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const result = await response.json();
    return result;
  };

  const handleEvaluate = async () => {
    setEvaluationLoading(true);
    const evalResults = await getEvaluationResults();

    // Call swot-proxy with the same request body as eval-proxy
    if (assessment_data) {
      const items = assessment_data.questions.map((q) => ({
        question_id: q.id,
        question: q.text,
        actual_answer: answers[q.id]?.text || "",
        expected_answer: q.expected_answer,
      }));
      try {
        if (!params?.id) {
          console.error("handleEvaluate: params.id is undefined");
        }
        const swotRes = await fetch("/api/swot-proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const swotJson = await swotRes.json();
        console.log("SWOT Analysis Response:", swotJson);
        setSwotData(swotJson);
        await saveSwotAnalysis(assessment_data.id, swotJson);
      } catch (err) {
        console.error("SWOT analysis error", err);
      }
    }

    let mappedResults = [];
    if (assessment_data && evalResults && Array.isArray(evalResults.details)) {
      mappedResults = evalResults.details.map(
        (item: {
          question_id: string;
          score: number;
          correct: boolean;
          feedback: string;
        }) => {
          return {
            question_id: item.question_id,
            marks: item.score,
            is_correct: item.correct,
            feedback: item.feedback,
            analysis: "",
          };
        }
      );
    }

    const response = await fetch(`/api/evaluate/${params?.id}`, {
      method: "POST",
      body: JSON.stringify({
        evaluation_results: mappedResults,
      }),
    });
    const result = await response.json();
    console.log("Evaluation Result:", result);
    if (result.evaluated && result.evaluation_results) {
      let marks = 0;
      const correctnessMap: Record<string, boolean> = {};
      result.evaluation_results.forEach(
        (item: {
          marks: number;
          question_id: string | number;
          is_correct: boolean;
        }) => {
          marks += item.marks;
          correctnessMap[item.question_id] = item.is_correct;
        }
      );

      setEarnedMarks(marks);
      setCorrectness(correctnessMap);

      setAssessment_data((prev) =>
        prev
          ? {
              ...prev,
              evaluated: result.evaluated,
              evaluation_results: result.evaluation_results,
              questions: prev.questions.map((q) => ({
                ...q,
                answer: answers[q.id]?.text || "",
              })),
            }
          : prev
      );
    }
    setIsEvaluated(true);
    setEvaluationLoading(false);
    toast("Assessment Evaluated", {
      description: `You've scored ${result.earnedMarks}`,
    });
  };

  const questionsAnswered = Object.keys(completionStatus).filter(
    (key) => completionStatus[key]
  ).length;

  if (!assessment_data) {
    return <Loading />;
  }
  if (evaluationLoading) {
    return <Loading />;
  }
  return (
    <Tabs defaultValue="complete" className="flex-1 px-6">
      <div className="container h-full py-6">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_300px]">
          <div className="hidden flex-col space-y-4 sm:flex md:order-2">
            <AssessmentSidebar
              id={assessment_data.id}
              title={assessment_data.title}
              description={assessment_data.description}
              startDate={new Date(assessment_data.start_date)}
              endDate={new Date(assessment_data.end_date)}
              maxScore={assessment_data.max_score}
              passingScore={assessment_data.passing_score}
              subject={assessment_data.subject}
              questionsAnswered={questionsAnswered}
              totalQuestions={assessment_data.questions.length}
              earnedMarks={earnedMarks}
              isSubmitted={isSubmitted}
              isEvaluated={isEvaluated}
              onSubmit={() => setShowSubmitDialog(true)}
              onEvaluate={handleEvaluate}
              onSave={handleSave}
              submitDisabled={!allQuestionsAnswered}
              evaluateDisabled={!isSubmitted || isEvaluated}
            />
          </div>
          <div className="md:order-1">
            <TabsContent value="complete" className="mt-0 border-0 p-0">
              <div className="flex h-full flex-col space-y-4 relative">
                {/* Fixed height container with overflow handling */}
                <div className="min-h-[400px] max-h-[400px] flex-1 bg-accent p-4 md:min-h-[500px] md:max-h-[500px] lg:min-h-[645px] lg:max-h-[645px] overflow-y-auto">
                  {/* Even if this is h-screen, it will be contained within the parent */}
                  <div className="h-screen">
                    {assessment_data.questions.map((question, index) => {
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
                              {isAnswered || isSubmitted ? (
                                isSubmitted && isEvaluated ? (
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

                          {question.type === "MCQ" && (
                            <MultipleChoiceQuestion
                              id={question.id}
                              question={question.text}
                              options={question.options || []}
                              marks={question.marks}
                              expected_answer={question.expected_answer}
                              answer={question?.answer}
                              feedback={
                                assessment_data.evaluation_results?.find(
                                  (result) => result.question_id === question.id
                                )?.feedback
                              }
                              isSubmitted={isSubmitted}
                              isEvaluated={isEvaluated}
                              showCorrectAnswer={isSubmitted && isEvaluated}
                              onAnswerChange={(answer) =>
                                handleAnswerChange(question.id, answer)
                              }
                              resources={question.resources}
                            />
                          )}

                          {question.type === "SHORT_ANSWER" && (
                            <ShortAnswerQuestion
                              id={question.id}
                              question={question.text}
                              marks={question.marks}
                              expected_answer={question.expected_answer}
                              answer={question?.answer}
                              feedback={
                                assessment_data.evaluation_results?.find(
                                  (result) => result.question_id === question.id
                                )?.feedback
                              }
                              isSubmitted={isSubmitted}
                              isEvaluated={isEvaluated}
                              showCorrectAnswer={isSubmitted && isEvaluated}
                              onAnswerChange={(answer) =>
                                handleAnswerChange(question.id, answer)
                              }
                              onImageUpload={(imageUrl) =>
                                handleImageUpload(question.id, imageUrl)
                              }
                              imageTypeAnswer={question.answer_type === "Image"}
                              resources={question.resources}
                            />
                          )}

                          {question.type === "LONG_ANSWER" && (
                            <LongAnswerQuestion
                              id={question.id}
                              question={question.text}
                              marks={question.marks}
                              expected_answer={question.expected_answer}
                              feedback={
                                assessment_data.evaluation_results?.find(
                                  (result) => result.question_id === question.id
                                )?.feedback
                              }
                              answer={question?.answer}
                              isSubmitted={isSubmitted}
                              isEvaluated={isEvaluated}
                              showCorrectAnswer={isSubmitted && isEvaluated}
                              onAnswerChange={(answer) =>
                                handleAnswerChange(question.id, answer)
                              }
                              onImageUpload={(imageUrl) =>
                                handleImageUpload(question.id, imageUrl)
                              }
                              imageTypeAnswer={question.answer_type === "IMAGE"}
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
                        {assessment_data.questions.length} questions.
                        {questionsAnswered <
                          assessment_data.questions.length && (
                          <p className="mt-2 text-amber-500 font-medium">
                            Warning: You have{" "}
                            {assessment_data.questions.length -
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

                {/* SWOT Analysis Section */}
                {swotData && (
                  <div className="mt-4 p-4 border rounded bg-muted">
                    <h3 className="font-bold mb-2">SWOT Analysis</h3>
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(swotData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </Tabs>
  );
};

export default Assessment;
