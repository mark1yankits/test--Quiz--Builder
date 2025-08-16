export interface Quiz {
    id: string;
    title: string;
    questions: Question[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Question {
    id: string;
    type: 'boolean' | 'input' | 'checkbox';
    text: string;
    options?: string[];
    correctAnswers?: string[];
  }
  
  export interface CreateQuizRequest {
    title: string;
    questions: Omit<Question, 'id'>[];
  }
  
  export interface QuizListResponse {
    id: string;
    title: string;
    questionCount: number;
    createdAt: string;
    updatedAt: string;
  }