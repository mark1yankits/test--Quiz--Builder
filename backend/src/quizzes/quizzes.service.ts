// src/quizzes/quizzes.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    try {
      const quiz = await this.prisma.quiz.create({
        data: {
          title: createQuizDto.title,
          questions: {
            create: createQuizDto.questions.map(question => ({
              text: question.text,
              type: question.type,
              options: question.options || [],
              correctAnswers: question.correctAnswers || [],
            })),
          },
        },
        include: {
          questions: true,
        },
      });

      return quiz;
    } catch (error) {
      throw new BadRequestException('Error creating quiz');
    }
  }

  async findAll() {
    try {
      const quizzes = await this.prisma.quiz.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              questions: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return quizzes.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        questionCount: quiz._count.questions,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt,
      }));
    } catch (error) {
      throw new BadRequestException('Problem with getting quizzes list');
    }
  }

  async findOne(id: string) {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id },
        include: {
          questions: {
            orderBy: {
              id: 'asc',
            },
          },
        },
      });

      if (!quiz) {
        throw new NotFoundException(`Quiz with ID ${id} not found`);
      }

      return quiz;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Problem with getting quiz');
    }
  }

  async remove(id: string) {
    try {
      const existingQuiz = await this.prisma.quiz.findUnique({
        where: { id },
      });

      if (!existingQuiz) {
        throw new NotFoundException(`Quiz with ID ${id} not found`);
      }

      await this.prisma.quiz.delete({
        where: { id },
      });

      return { message: 'Quiz successfully deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Problem with deleting quiz');
    }
  }
}