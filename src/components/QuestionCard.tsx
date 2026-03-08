import React, { useState, useEffect } from 'react';
import { Flag, ArrowRight } from 'lucide-react';
import { Question } from '../data/questions';
import { OptionItem } from './OptionItem';
import { motion } from 'motion/react';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>("B"); // Pre-selecting B to match design for demo
  const [isSubmitted, setIsSubmitted] = useState(true); // Pre-submitted to match design

  // Reset state when question changes (if we had multiple questions)
  useEffect(() => {
    // In a real app, we'd reset here if the question prop changed
    // setSelectedOptionId(null);
    // setIsSubmitted(false);
  }, [question.id]);

  const handleSelect = (id: string) => {
    if (!isSubmitted) {
      setSelectedOptionId(id);
    }
  };

  const handleSubmit = () => {
    if (selectedOptionId) {
      setIsSubmitted(true);
    }
  };

  const handleNext = () => {
    // Logic for next question would go here
    alert("Next question clicked");
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) {
        if (e.key === 'Enter') handleNext();
        return;
      }

      switch (e.key) {
        case '1': handleSelect(question.options[0].id); break;
        case '2': handleSelect(question.options[1].id); break;
        case '3': handleSelect(question.options[2].id); break;
        case '4': handleSelect(question.options[3].id); break;
        case 'Enter': handleSubmit(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, selectedOptionId, question.options]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100"
      >
        {/* Card Header */}
        <div className="p-8 pb-0">
          <span className="inline-block px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold tracking-wider uppercase mb-6">
            {question.type}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            {question.text}
          </h2>
        </div>

        {/* Options List */}
        <div className="p-8 pt-8">
          {question.options.map((option, index) => (
            <OptionItem
              key={option.id}
              index={index}
              option={option}
              isSelected={selectedOptionId === option.id}
              isSubmitted={isSubmitted}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-6 px-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-semibold transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            Flag for Review
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isSubmitted ? (
              <button 
                onClick={handleSubmit}
                disabled={!selectedOptionId}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
                  selectedOptionId 
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <>
                <button 
                  disabled
                  className="hidden sm:block px-8 py-3 rounded-xl font-bold bg-slate-200 text-slate-400 cursor-not-allowed"
                >
                  Submit
                </button>
                <button 
                  onClick={handleNext}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all transform active:scale-95"
                >
                  Next Question
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Keyboard Hint */}
      <div className="text-center mt-8 text-slate-400 text-sm">
        <p>
          Pro Tip: Use keys <kbd className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-mono text-xs mx-1">1-4</kbd> to select an option and <kbd className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-mono text-xs mx-1">Enter</kbd> to submit.
        </p>
      </div>
    </div>
  );
};
