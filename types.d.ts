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
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Add any other common types you identify in your project