import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  domain: string;
}

export const Header: React.FC<HeaderProps> = ({ currentQuestion, totalQuestions, domain }) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-4 rounded-xl transition-opacity hover:opacity-80">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-blue-200">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">
              Insurance Agent License Practice Exam
            </h1>
            <p className="text-slate-500 text-sm">Domain: {domain}</p>
          </div>
        </Link>

        <div className="flex flex-col items-end gap-2 min-w-[220px]">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Back to Dashboard
          </Link>
          <div className="flex w-full items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <span className="whitespace-nowrap">Question {currentQuestion} of {totalQuestions}</span>
            <span className="whitespace-nowrap text-blue-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
