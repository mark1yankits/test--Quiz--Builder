'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { quizApi } from '@/services/api';
import { Quiz } from '@/types';

export default function QuizDetailPage() {
  const params = useParams();
  const quizId = params.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
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
          <Link
            href="/quizzes"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const renderQuestion = (question: any, index: number) => {
    return (
      <div key={question.id} className="border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
            {index + 1}
          </span>
          <div className="flex-1">
            <h4 className="text-lg font-medium text-gray-900 mb-3">{question.text}</h4>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Type:</span> {question.type}
              </p>
              
              {question.options && question.options.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Options:</p>
                  <div className="space-y-1">
                    {question.options.map((option: string, optionIndex: number) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type={question.type === 'boolean' ? 'radio' : 'checkbox'}
                          checked={question.correctAnswers.includes(option)}
                          readOnly
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {question.type === 'input' && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Correct Answer:</p>
                  <p className="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded">
                    {question.correctAnswers[0]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
              <p className="text-gray-600">
                Created on {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Link
              href="/quizzes"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              Back to Quizzes
            </Link>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Questions ({quiz.questions.length})
            </h2>
            
            <div className="space-y-4">
              {quiz.questions.map((question, index) => renderQuestion(question, index))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}