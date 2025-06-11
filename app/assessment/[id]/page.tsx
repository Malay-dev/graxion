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
  CheckSquare,
  Shield,
} from "@phosphor-icons/react/dist/ssr";
import Loading from "@/components/Loading";

// Define the SWOT analysis interface
interface SwotAnalysis {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

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

// Component to display SWOT analysis
const SwotAnalysisDisplay: React.FC<{ swotData: SwotAnalysis }> = ({
  swotData,
}) => {
  const swotCategories = [
    {
      key: "strengths",
      label: "Strengths",
      icon: <CheckSquare className="h-6 w-6 text-green-600" />,
      description: swotData.strengths,
    },
    {
      key: "weaknesses",
      label: "Weaknesses",
      icon: <CheckSquare className="h-6 w-6 text-yellow-600" />,
      description: swotData.weaknesses,
    },
    {
      key: "opportunities",
      label: "Opportunities",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      description: swotData.opportunities,
    },
    {
      key: "threats",
      label: "Threats",
      icon: <Shield className="h-6 w-6 text-red-600" />,
      description: swotData.threats,
    },
  ];

  return (
    <div className="mt-4 p-4 border rounded bg-muted">
      <h3 className="text-lg font-bold mb-4 text-foreground">SWOT Analysis</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {swotCategories.map((category) => (
          <div
            key={category.key}
            className="p-4 border rounded bg-background shadow-sm"
            role="region"
            aria-labelledby={`${category.key}-heading`}>
            <div className="flex items-center mb-2">
              {category.icon}
              <h4
                id={`${category.key}-heading`}
                className="ml-2 text-md font-semibold text-foreground">
                {category.label}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
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
  const [swotData, setSwotData] = useState<SwotAnalysis | null>(null);
  const [assessment_data, setAssessment_data] = useState<AssessmentData>();
  const params = useParams();

  // Function to get SWOT from localStorage
  const getCachedSwot = (assessmentId: string): SwotAnalysis | null => {
    try {
      const cached = localStorage.getItem(`swot_${assessmentId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (err) {
      console.error("Error reading SWOT from cache:", err);
      return null;
    }
  };

  // Function to save SWOT to localStorage
  const saveCachedSwot = (assessmentId: string, swot: SwotAnalysis) => {
    try {
      localStorage.setItem(`swot_${assessmentId}`, JSON.stringify(swot));
    } catch (err) {
      console.error("Error saving SWOT to cache:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/assessments/${params?.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch assessment: ${response.status}`);
        }
        const result = await response.json();
        setAssessment_data(result);
        console.log("Fetched assessment:", result);
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
        // Load cached SWOT data
        if (params?.id) {
          const cachedSwot = getCachedSwot(params.id as string);
          if (cachedSwot) {
            setSwotData(cachedSwot);
          }
        }
      } catch (err) {
        console.error("Error fetching assessment:", err);
        toast.error("Failed to load assessment data");
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
    const answerObj = typeof answer === "string" ? { text: answer } : answer;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ...answerObj,
      },
    }));
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
    if (!completionStatus[questionId]) {
      setCompletionStatus((prev) => ({
        ...prev,
        [questionId]: true,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/submit/${params?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }
      setIsSubmitted(true);
      toast("Assessment Submitted", {
        description: "Submission saved. Awaiting evaluation.",
      });
    } catch (err) {
      console.error("Error submitting assessment:", err);
      toast.error("Failed to submit assessment");
    }
  };

  const handleSave = () => {
    toast("Progress Saved", {
      description: "Your progress has been saved successfully.",
    });
  };

  const getEvaluationResults = async () => {
    if (!assessment_data) return null;
    const items = assessment_data.questions.map((q) => ({
      question_id: q.id,
      question: q.text,
      actual_answer: answers[q.id]?.text || "",
      expected_answer: q.expected_answer,
    }));
    try {
      const response = await fetch("/api/eval-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) {
        throw new Error(`Evaluation failed: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (err) {
      console.error("Error evaluating assessment:", err);
      toast.error("Failed to evaluate assessment");
      return null;
    }
  };

  const handleEvaluate = async () => {
    setEvaluationLoading(true);
    const evalResults = await getEvaluationResults();

    if (assessment_data && params?.id) {
      const items = assessment_data.questions.map((q) => ({
        question_id: q.id,
        question: q.text,
        actual_answer: answers[q.id]?.text || "",
        expected_answer: q.expected_answer,
      }));
      try {
        const swotRes = await fetch("/api/swot-proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        if (!swotRes.ok) {
          throw new Error(`SWOT analysis failed: ${swotRes.status}`);
        }
        const swotJson = await swotRes.json();
        console.log("SWOT Analysis Response:", swotJson);
        setSwotData(swotJson);
        // Save to cache
        saveCachedSwot(params.id as string, swotJson);
        // Save to Firestore
        // await saveSwotAnalysis(params.id as string, swotJson);
      } catch (err) {
        console.error("SWOT analysis error:", err);
        toast.error("Failed to generate SWOT analysis");
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
        }) => ({
          question_id: item.question_id,
          marks: item.score,
          is_correct: item.correct,
          feedback: item.feedback,
          analysis: "",
        })
      );
    }

    try {
      const response = await fetch(`/api/evaluate/${params?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluation_results: mappedResults,
        }),
      });
      if (!response.ok) {
        throw new Error(`Evaluation save failed: ${response.status}`);
      }
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
      toast("Assessment Evaluated", {
        description: `You've scored ${result.earnedMarks}`,
      });
    } catch (err) {
      console.error("Error saving evaluation:", err);
      toast.error("Failed to save evaluation results");
    } finally {
      setEvaluationLoading(false);
    }
  };

  const questionsAnswered = Object.keys(completionStatus).filter(
    (key) => completionStatus[key]
  ).length;

  if (!assessment_data || evaluationLoading) {
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
                <div className="min-h-[400px] max-h-[400px] flex-1 bg-accent p-4 md:min-h-[500px] md:max-h-[500px] lg:min-h-[645px] lg:max-h-[645px] overflow-y-auto">
                  <div className="h-screen">
                    {assessment_data.questions.map((question, index) => {
                      const isAnswered = completionStatus[question.id] === true;
                      const isCorrect =
                        completionStatus[question.id] === true &&
                        correctness[question.id] === true;
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

                {swotData && <SwotAnalysisDisplay swotData={swotData} />}
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </Tabs>
  );
};

export default Assessment;
