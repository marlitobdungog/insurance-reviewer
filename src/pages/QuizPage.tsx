import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { QuestionCard } from '../components/QuestionCard';
import type { Question } from '../data/questions';

export const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        const nextQuestions = Array.isArray(data.questions) ? data.questions : [];

        if (nextQuestions.length === 0) {
          throw new Error('No questions available');
        }

        setQuestions(nextQuestions);
        setCurrentIndex(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIndex] ?? null;
  const handleNextQuestion = () => {
    setCurrentIndex((current) => Math.min(current + 1, questions.length - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error || !currentQuestion) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Question not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-20">
      <Header 
        currentQuestion={currentIndex + 1} 
        totalQuestions={questions.length} 
        domain={currentQuestion.domain} 
      />
      
      <main className="pt-12 px-4">
        <QuestionCard
          question={currentQuestion}
          onNext={handleNextQuestion}
          hasNextQuestion={currentIndex < questions.length - 1}
        />
      </main>
    </div>
  );
};
