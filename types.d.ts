export interface Question {
  id?: string;
  type: 'multiple-choice' | 'short-answer' | 'long-answer';
  text: string;
  options?: string[]; // for multiple-choice
  correctAnswer?: string | string[]; // for short-answer and long-answer, or multiple correct options for multiple-choice
}

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
};


export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Add any other common types you identify in your project