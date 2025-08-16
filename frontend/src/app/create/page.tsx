'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { quizApi } from '@/services/api';

interface Question {
  text: string;
  type: 'boolean' | 'input' | 'checkbox';
  options: string[];
  correctAnswers: string[];
}

interface CreateQuizForm {
  title: string;
  questions: Question[];
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<CreateQuizForm>({
    defaultValues: {
      title: '',
      questions: [
        {
          text: '',
          type: 'boolean',
          options: ['Yes', 'No'],
          correctAnswers: ['Yes']
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  const watchedQuestions = watch('questions');

  const addQuestion = () => {
    append({
      text: '',
      type: 'boolean',
      options: ['Yes', 'No'],
      correctAnswers: ['Yes']
    });
  };

  const removeQuestion = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: CreateQuizForm) => {
    try {
      setIsSubmitting(true);
      await quizApi.create(data);
      router.push('/quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Quiz</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Quiz Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title
              </label>
              <input
                {...register('title', { required: 'Quiz title is required' })}
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quiz title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Add Question
                </button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      disabled={fields.length === 1}
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </label>
                    <textarea
                      {...register(`questions.${index}.text` as const, { 
                        required: 'Question text is required' 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your question"
                      rows={3}
                    />
                  </div>

                  {/* Question Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      {...register(`questions.${index}.type` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="boolean">True/False</option>
                      <option value="input">Text Input</option>
                      <option value="checkbox">Multiple Choice</option>
                    </select>
                  </div>

                  {/* Options for boolean and checkbox */}
                  {(watchedQuestions[index]?.type === 'boolean' || watchedQuestions[index]?.type === 'checkbox') && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Options
                      </label>
                      {watchedQuestions[index]?.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <input
                            {...register(`questions.${index}.options.${optionIndex}` as const)}
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          <input
                            {...register(`questions.${index}.correctAnswers` as const)}
                            type={watchedQuestions[index]?.type === 'boolean' ? 'radio' : 'checkbox'}
                            value={option}
                            className="ml-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Correct Answer for input */}
                  {watchedQuestions[index]?.type === 'input' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer
                      </label>
                      <input
                        {...register(`questions.${index}.correctAnswers.0` as const, { 
                          required: 'Correct answer is required' 
                        })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter correct answer"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/quizzes')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}