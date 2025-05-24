export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id?: string;
  text: string;
  type: string;
  answer_type: string;
  expected_answer: string;
  image_url: string;
  assessmentId: string;
  options: Option[];
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