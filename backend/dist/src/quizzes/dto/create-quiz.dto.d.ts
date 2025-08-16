export declare class CreateQuestionDto {
    text: string;
    type: 'boolean' | 'input' | 'checkbox';
    options?: string[];
    correctAnswers?: string[];
}
export declare class CreateQuizDto {
    title: string;
    questions: CreateQuestionDto[];
}
