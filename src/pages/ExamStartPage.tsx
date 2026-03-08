import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, HelpCircle, CheckCircle2, Shield, ArrowRight, FileText } from 'lucide-react';

export const ExamStartPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 px-6 md:px-12 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
            <Shield size={18} fill="currentColor" />
          </div>
          <span className="text-lg font-bold text-orange-600">ExamPrep Pro</span>
        </div>
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 pb-24">
        {/* Hero Section */}
        <div className="bg-[#FAF9F6] rounded-3xl p-8 md:p-12 mb-12 border border-slate-100 shadow-sm">
          <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
            Official Study Guide
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Insurance Agent License
          </h1>
          <h1 className="text-4xl md:text-6xl font-extrabold text-orange-600 mb-8 tracking-tight">
            Practice Exam
          </h1>
          
          <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mb-12">
            Comprehensive practice to help you ace your certification. This practice exam is 
            designed to simulate the actual licensing test environment. Use this to identify 
            your strengths and weaknesses in core insurance concepts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard 
              icon={<Clock className="text-orange-600" />} 
              label="DURATION" 
              value="90 Minutes" 
            />
            <InfoCard 
              icon={<HelpCircle className="text-orange-600" />} 
              label="QUESTIONS" 
              value="100 Multiple Choice" 
            />
            <InfoCard 
              icon={<CheckCircle2 className="text-orange-600" />} 
              label="PASSING SCORE" 
              value="70% Minimum" 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Instructions */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <FileText className="text-orange-600 w-6 h-6" />
              <h2 className="text-2xl font-bold text-slate-900">Exam Instructions</h2>
            </div>

            <div className="space-y-8">
              <InstructionItem 
                title="Comprehensive Coverage" 
                description="Topics include General Insurance Principles, Life, Health, Property, and Liability." 
              />
              <InstructionItem 
                title="Real-time Feedback" 
                description="Immediate feedback provided for every answer during the review session." 
              />
              <InstructionItem 
                title="In-depth Learning" 
                description="Detailed explanations for all choices to enhance understanding of complex concepts." 
              />
              <InstructionItem 
                title="Auto-save" 
                description="Your progress is saved automatically. You can leave and return at any time." 
              />
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-[#0F172A] rounded-2xl p-8 md:p-10 text-white shadow-xl shadow-slate-900/10 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Ensure you are in a quiet environment and have a stable internet connection. 
              You can take this practice exam as many times as needed.
            </p>
            
            <button 
              onClick={() => navigate('/quiz')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
            >
              Start Exam Review
              <ArrowRight size={20} />
            </button>
            
            <p className="text-center text-slate-500 text-xs mt-4 leading-relaxed">
              By clicking start, you agree to our terms of service for practice examinations.
            </p>
          </div>
        </div>

        {/* Bottom Image */}
        <div className="mt-16 relative h-64 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80" 
            alt="Study materials" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </main>

      <footer className="bg-[#F8F9FC] border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        <p>© 2024 ExamPrep Pro. All rights reserved. Professional Licensing Preparation Tools.</p>
      </footer>
    </div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 shadow-sm">
    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const InstructionItem = ({ title, description }: { title: string, description: string }) => (
  <div className="flex gap-4">
    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
      <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
    </div>
    <div>
      <h3 className="font-bold text-slate-900 mb-1">{title}:</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  </div>
);
