import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { QuestionCard } from '../components/QuestionCard';
import type { Question } from '../data/questions';

export const QuizPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('/api/questions/15');
        if (!response.ok) {
          throw new Error('Failed to fetch question');
        }
        const data = await response.json();
        setCurrentQuestion(data);
      } catch (err) {
        setError('Failed to load question');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, []);

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
        currentQuestion={currentQuestion.id} 
        totalQuestions={100} 
        domain={currentQuestion.domain} 
      />
      
      <main className="pt-12 px-4">
        <QuestionCard question={currentQuestion} />
      </main>
    </div>
  );
};
