export type Question = {
  id: string;
  type: "SHORT_ANSWER" | "LONG_ANSWER" | "MCQ" | string;
  text: string;
  answer_type: "Text" | "Image" | string;
  image_url?: string;
  options?: {
    id: string;
    text: string;
  }[];
  expected_answer: string;
  isCorrect?: boolean;
  answer?: string;
  marks: number;
  resources?: {
    video?: { title: string; url: string };
    ref_videos?: { title: string; url: string }[];
    ref_articles?: { title: string; url: string }[];
  };
};

export type EvaluationResult = {
  question_id: string;
  marks: number;
  is_correct: boolean;
  feedback?: string;
  analysis?: string;
};

export interface Assessment {
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
  questions: Question[];
  evaluation_results?: EvaluationResult[];
  no_st_attempted: number;
  no_st_passed: number;
  class: string;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Submission {
  id: number;
  assessmentId: number;
  studentId: number;
  fileUrl: string;
  done: boolean;
}

// Add any other common types you identify in your project
