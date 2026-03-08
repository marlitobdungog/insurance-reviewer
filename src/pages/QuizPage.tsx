import React, { useState } from 'react';
import { Header } from '../components/Header';
import { QuestionCard } from '../components/QuestionCard';
import { sampleQuestion } from '../data/questions';

export const QuizPage: React.FC = () => {
  // In a real app, we would fetch the question based on ID or progress
  const [currentQuestion] = useState(sampleQuestion);

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-20">
      <Header 
        currentQuestion={15} 
        totalQuestions={100} 
        domain={currentQuestion.domain} 
      />
      
      <main className="pt-12 px-4">
        <QuestionCard question={currentQuestion} />
      </main>
    </div>
  );
};
