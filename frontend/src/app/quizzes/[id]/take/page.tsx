'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { quizApi } from '@/services/api';
import { Quiz } from '@/types';


interface UserAnswer {
  questionId: string;
  answer: string | string[];
}

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: UserAnswer[];
}

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getById(quizId);
      setQuiz(response.data);
      
      // Initialize user answers
      const initialAnswers = response.data.questions.map((q: any) => ({
        questionId: q.id,
        answer: q.type === 'checkbox' ? [] : ''
      }));
      setUserAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setUserAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId ? { ...a, answer } : a
      )
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!quiz) return;

    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      
      if (question.type === 'boolean' || question.type === 'input') {
        if (userAnswer.answer === question.correctAnswers?.[0]) {
          correctAnswers++;
        }
      } else if (question.type === 'checkbox') {
        const userAnswersArray = Array.isArray(userAnswer.answer) ? userAnswer.answer : [];
        const correctAnswersArray = question.correctAnswers;
        
        if (userAnswersArray.length === correctAnswersArray?.length &&
            userAnswersArray.every(answer => correctAnswersArray.includes(answer))) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    setQuizResult({
      totalQuestions,
      correctAnswers,
      score,
      answers: userAnswers
    });
    
    setShowResults(true);
  };

  const renderQuestion = (question: any, index: number) => {
    const userAnswer = userAnswers[index];
    const isCurrentQuestion = index === currentQuestionIndex;

    if (!isCurrentQuestion) return null;

    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              Question {index + 1} of {quiz?.questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{question.text}</h3>
        </div>

        <div className="space-y-4">
          {question.type === 'boolean' && (
            <div className="space-y-3">
              {question.options.map((option: string) => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={userAnswer.answer === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'input' && (
            <div>
              <input
                type="text"
                value={userAnswer.answer as string}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {question.type === 'checkbox' && (
            <div className="space-y-3">
              {question.options.map((option: string) => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option}
                    checked={(userAnswer.answer as string[]).includes(option)}
                    onChange={(e) => {
                      const currentAnswers = userAnswer.answer as string[];
                      if (e.target.checked) {
                        handleAnswerChange(question.id, [...currentAnswers, option]);
                      } else {
                        handleAnswerChange(question.id, currentAnswers.filter(a => a !== option));
                      }
                    }}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!quizResult || !quiz) return null;

    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quiz Results</h2>
        
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-blue-600 mb-2">{quizResult.score}%</div>
          <p className="text-lg text-gray-600">
            You got {quizResult.correctAnswers} out of {quizResult.totalQuestions} questions correct
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {quiz.questions.map((question, index) => {
            const userAnswer = quizResult.answers[index];
            const isCorrect = question.type === 'boolean' || question.type === 'input' 
              ? userAnswer.answer === question.correctAnswers?.[0]
              : Array.isArray(userAnswer.answer) && 
                userAnswer.answer.length === question.correctAnswers?.length &&
                userAnswer.answer.every(answer => question.correctAnswers?.includes(answer));

            return (
              <div key={question.id} className={`p-4 rounded-lg border ${
                isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Your answer:</span> {
                        Array.isArray(userAnswer.answer) 
                          ? userAnswer.answer.join(', ') 
                          : userAnswer.answer
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Correct answer:</span> {question.correctAnswers?.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setShowResults(false);
              setCurrentQuestionIndex(0);
              setUserAnswers(userAnswers.map(a => ({ ...a, answer: a.questionId.includes('checkbox') ? [] : '' })));
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => router.push('/quizzes')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading quiz...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error || 'Quiz not found'}</div>
          <button
            onClick={() => router.push('/quizzes')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {renderResults()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
            <button
              onClick={() => router.push(`/quizzes/${quizId}`)}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              View Quiz Details
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Answer all questions to complete the quiz
          </p>
        </div>

        {renderQuestion(quiz.questions[currentQuestionIndex], currentQuestionIndex)}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex space-x-4">
            {currentQuestionIndex === (quiz.questions.length - 1) ? (
              <button
                onClick={handleSubmitQuiz}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {currentQuestionIndex + 1} of {quiz.questions.length} questions
          </p>
        </div>
      </div>
    </div>
  );
}