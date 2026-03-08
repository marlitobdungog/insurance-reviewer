import React from 'react';
import { Check, X, Info, Circle } from 'lucide-react';
import { Option } from '../data/questions';
import { motion, AnimatePresence } from 'motion/react';

interface OptionItemProps {
  option: Option;
  isSelected: boolean;
  isSubmitted: boolean;
  onSelect: (id: string) => void;
  index: number;
}

export const OptionItem: React.FC<OptionItemProps> = ({ 
  option, 
  isSelected, 
  isSubmitted, 
  onSelect,
  index 
}) => {
  // Determine styles based on state
  let containerClasses = "relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-4 group ";
  let circleClasses = "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ";
  
  if (isSubmitted) {
    if (option.isCorrect) {
      // Correct Answer Styling
      containerClasses += "bg-emerald-50 border-emerald-500 shadow-sm";
      circleClasses += "border-emerald-500 text-emerald-600 bg-white";
    } else if (isSelected && !option.isCorrect) {
      // Wrong Selection Styling
      containerClasses += "bg-white border-red-500 shadow-sm";
      circleClasses += "border-red-500 bg-red-500 text-white"; // Filled red for wrong selection
    } else {
      // Unselected Wrong Options
      containerClasses += "bg-white border-slate-100 opacity-60";
      circleClasses += "border-slate-200 text-transparent";
    }
  } else {
    // Interactive State (Not Submitted)
    if (isSelected) {
      containerClasses += "bg-blue-50 border-blue-600 shadow-md ring-1 ring-blue-600/20";
      circleClasses += "border-blue-600 bg-blue-600 text-white";
    } else {
      containerClasses += "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50 hover:shadow-sm";
      circleClasses += "border-slate-300 group-hover:border-blue-400 text-transparent";
    }
  }

  // Feedback Box Styling
  let feedbackBg = "";
  let feedbackText = "";
  let feedbackBorder = "";

  if (option.isCorrect) {
    feedbackBg = "bg-emerald-50";
    feedbackText = "text-emerald-800";
    feedbackBorder = "border-emerald-100";
  } else if (isSelected && !option.isCorrect) {
    feedbackBg = "bg-amber-50"; // Using amber/orange for the specific "Incorrect" warning feel from design
    feedbackText = "text-amber-900";
    feedbackBorder = "border-amber-100";
  } else {
    feedbackBg = "bg-red-50";
    feedbackText = "text-red-900";
    feedbackBorder = "border-red-100";
  }

  return (
    <div className="mb-6">
      {/* Option Card */}
      <div 
        onClick={() => !isSubmitted && onSelect(option.id)}
        className={containerClasses}
      >
        <div className={circleClasses}>
          {isSubmitted && option.isCorrect ? (
             // Empty green circle in design for correct answer, but let's check
             // Design shows just a green circle outline for option C.
             // But for Option B (selected wrong), it shows a filled red dot-like circle.
             // Let's stick to standard radio behavior + icons.
             // Actually, looking at the design:
             // A: Empty gray circle
             // B: Red circle with red dot inside (Radio selected style)
             // C: Green circle empty (Just outline)
             // D: Empty gray circle
             // I will implement a custom radio indicator.
             null
          ) : isSubmitted && isSelected && !option.isCorrect ? (
             <div className="w-2.5 h-2.5 bg-white rounded-full" />
          ) : isSelected ? (
             <div className="w-2.5 h-2.5 bg-white rounded-full" />
          ) : null}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <span className={`font-medium text-lg ${isSubmitted && !option.isCorrect && !isSelected ? 'text-slate-500' : 'text-slate-900'}`}>
              <span className="font-bold mr-2">{option.id}.</span>
              {option.text}
            </span>
            
            {isSubmitted && option.isCorrect && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded uppercase tracking-wider ml-2 shrink-0">
                Correct Answer
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Feedback / Explanation Box */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-3 rounded-lg p-4 text-sm leading-relaxed border ${feedbackBg} ${feedbackText} ${feedbackBorder} flex gap-3`}
          >
            {option.isCorrect ? (
              <Check className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            ) : isSelected ? (
              <Info className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            ) : (
              // Design shows empty circle or just text for unselected incorrect ones?
              // Design shows "Incorrect." in red box.
              // Let's use a subtle X or just text.
              // Design for A (unselected wrong) has no icon, just text.
              // Design for B (selected wrong) has an 'i' icon.
              // Design for C (correct) has a check icon.
              // Design for D (unselected wrong) has no icon.
              null
            )}
            
            <div>
              <span className="font-bold">
                {option.isCorrect ? "Correct! " : "Incorrect. "}
              </span>
              {option.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
