import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, Option } from '../data/questions';

interface QuestionEditorProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ 
  question, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Question>({
    id: 0,
    domain: '',
    text: '',
    type: 'MULTIPLE CHOICE',
    options: []
  });

  useEffect(() => {
    if (question) {
      setFormData(JSON.parse(JSON.stringify(question))); // Deep copy
    } else {
      // Reset for new question
      setFormData({
        id: Date.now(), // Temporary ID
        domain: '',
        text: '',
        type: 'MULTIPLE CHOICE',
        options: [
          { id: 'A', text: '', isCorrect: false, explanation: '' },
          { id: 'B', text: '', isCorrect: false, explanation: '' },
          { id: 'C', text: '', isCorrect: false, explanation: '' },
          { id: 'D', text: '', isCorrect: false, explanation: '' },
        ]
      });
    }
  }, [question, isOpen]);

  const handleOptionChange = (index: number, field: keyof Option, value: any) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    // If setting isCorrect to true, set others to false (for single choice)
    if (field === 'isCorrect' && value === true) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {question ? 'Edit Question' : 'New Question'}
                </h2>
                <p className="text-sm text-slate-500">
                  {question ? `ID: ${question.id}` : 'Create a new question'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <form id="question-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Basic Info Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-600 rounded-full"/>
                    Question Details
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Domain</label>
                      <input
                        type="text"
                        value={formData.domain}
                        onChange={(e) => setFormData({...formData, domain: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. General Insurance"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                      >
                        <option value="MULTIPLE CHOICE">Multiple Choice</option>
                        <option value="TRUE/FALSE">True / False</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Question Text</label>
                    <textarea
                      value={formData.text}
                      onChange={(e) => setFormData({...formData, text: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                      placeholder="Enter the question here..."
                    />
                  </div>
                </div>

                {/* Options Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-1 h-5 bg-emerald-500 rounded-full"/>
                      Answer Options
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {formData.options.map((option, index) => (
                      <div 
                        key={index}
                        className={`bg-white p-4 rounded-xl border transition-all ${
                          option.isCorrect 
                            ? 'border-emerald-500 ring-1 ring-emerald-500/20 shadow-sm' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Option ID & Correct Toggle */}
                          <div className="flex flex-col items-center gap-2 pt-1">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                              {option.id}
                            </div>
                            <label className="cursor-pointer group relative">
                              <input
                                type="radio"
                                name="correct-option"
                                checked={option.isCorrect}
                                onChange={() => handleOptionChange(index, 'isCorrect', true)}
                                className="peer sr-only"
                              />
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                option.isCorrect 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'border-slate-300 text-transparent hover:border-emerald-400'
                              }`}>
                                <CheckCircle2 size={14} />
                              </div>
                            </label>
                          </div>

                          {/* Option Content */}
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border outline-none transition-all font-medium ${
                                option.isCorrect
                                  ? 'border-emerald-200 bg-emerald-50/30 focus:border-emerald-500'
                                  : 'border-slate-200 focus:border-blue-500'
                              }`}
                              placeholder={`Option ${option.id} text...`}
                            />
                            
                            <div className="relative">
                              <div className="absolute left-3 top-2.5 text-slate-400">
                                {option.isCorrect ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} />}
                              </div>
                              <textarea
                                value={option.explanation}
                                onChange={(e) => handleOptionChange(index, 'explanation', e.target.value)}
                                rows={2}
                                className={`w-full pl-9 pr-3 py-2 rounded-lg border outline-none transition-all text-sm ${
                                  option.isCorrect
                                    ? 'border-emerald-100 bg-emerald-50/30 text-emerald-800 placeholder:text-emerald-800/40 focus:border-emerald-500'
                                    : 'border-slate-100 bg-slate-50 text-slate-600 focus:border-blue-500 focus:bg-white'
                                }`}
                                placeholder={option.isCorrect ? "Explain why this is correct..." : "Explain why this is incorrect..."}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 bg-white flex justify-between items-center">
              <button 
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
              >
                <Trash2 size={18} />
                Delete Question
              </button>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="question-form"
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
