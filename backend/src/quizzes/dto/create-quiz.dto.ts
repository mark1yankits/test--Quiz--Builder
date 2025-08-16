import { IsString, IsArray, ValidateNested, IsNotEmpty, MinLength, MaxLength, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty({ message: 'Question text cannot be empty' })
  @MinLength(3, { message: 'Question text must be at least 3 characters long' })
  @MaxLength(500, { message: 'Question text cannot exceed 500 characters' })
  @IsNotEmpty({ message: 'Question text cannot be empty' })
  text: string;


  @IsString()
  @IsNotEmpty({ message: 'Question type cannot be empty' })
  type: 'boolean' | 'input' | 'checkbox';

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'There must be at least 1 option' })
  options?: string[];


  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'There must be at least 1 correct answer' })
  correctAnswers?: string[];
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty({ message: 'Quiz title cannot be empty' })
  @MinLength(3, { message: 'Quiz title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Quiz title cannot exceed 100 characters' })
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @ArrayMinSize(1, { message: 'Quiz must contain at least 1 question' })
  questions: CreateQuestionDto[];
}