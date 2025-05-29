export type Question = {
  id: string;
  type: "SHORT_ANSWER" | "LONG_ANSWER" | "MCQ";
  text: string;
  answer_type: "Text" | "Image";
  options?: {
    id: string;
    text: string;
  }[];
  image_url?: string;
  expected_answer: string;
  marks: number;
};

export interface Assessment {
  id?: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  max_score: number;
  no_st_attempted: number;
  no_st_passed: number;
  passing_score: number;
  subject: string;
  class: string;
  questions?: Question[];
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
