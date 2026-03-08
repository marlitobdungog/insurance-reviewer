import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  MoreVertical,
  Filter
} from 'lucide-react';
import { sampleQuestion, Question } from '../data/questions';
import { QuestionEditor } from '../components/QuestionEditor';

// Mock data with full structure
const mockQuestions: Question[] = [
  sampleQuestion,
  {
    id: 16,
    domain: "Contract Law",
    text: "Which of the following best describes a contract of adhesion?",
    type: "MULTIPLE CHOICE",
    options: [
      { id: "A", text: "A contract negotiated between two equal parties.", isCorrect: false, explanation: "Incorrect." },
      { id: "B", text: "A contract prepared by one party and submitted to the other on a take-it-or-leave-it basis.", isCorrect: true, explanation: "Correct!" },
      { id: "C", text: "A contract that can be cancelled at any time.", isCorrect: false, explanation: "Incorrect." },
      { id: "D", text: "A contract involving illegal activities.", isCorrect: false, explanation: "Incorrect." }
    ]
  },
  {
    id: 17,
    domain: "Financial Regs",
    text: "An insurer is considered solvent if it has enough assets to cover its liabilities and reinsurance.",
    type: "TRUE/FALSE",
    options: [
      { id: "A", text: "True", isCorrect: true, explanation: "Correct!" },
      { id: "B", text: "False", isCorrect: false, explanation: "Incorrect." }
    ]
  },
  {
    id: 18,
    domain: "State Law",
    text: "What is the maximum penalty for a willful violation of the Insurance Code?",
    type: "MULTIPLE CHOICE",
    options: [
      { id: "A", text: "$1,000", isCorrect: false, explanation: "Incorrect." },
      { id: "B", text: "$5,000", isCorrect: false, explanation: "Incorrect." },
      { id: "C", text: "$10,000", isCorrect: false, explanation: "Incorrect." },
      { id: "D", text: "$25,000", isCorrect: true, explanation: "Correct!" }
    ]
  },
  {
    id: 19,
    domain: "General Insurance",
    text: "Risk retention groups are primarily formed to provide which type of insurance?",
    type: "MULTIPLE CHOICE",
    options: [
      { id: "A", text: "Life Insurance", isCorrect: false, explanation: "Incorrect." },
      { id: "B", text: "Liability Insurance", isCorrect: true, explanation: "Correct!" },
      { id: "C", text: "Health Insurance", isCorrect: false, explanation: "Incorrect." },
      { id: "D", text: "Property Insurance", isCorrect: false, explanation: "Incorrect." }
    ]
  }
];

export const AdminPage: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsEditorOpen(true);
  };

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setIsEditorOpen(true);
  };

  const handleSaveQuestion = (updatedQuestion: Question) => {
    console.log("Saving question:", updatedQuestion);
    // In a real app, update the list here
    setIsEditorOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-30">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">A</span>
            </div>
            AdminPanel
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem icon={<FileText size={20} />} label="Questions" active />
          <NavItem icon={<Users size={20} />} label="Candidates" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Question Bank</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              JD
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard label="Total Questions" value="1,240" change="+12 this week" />
            <StatCard label="Active Domains" value="8" change="Stable" />
            <StatCard label="Pending Review" value="14" change="Requires attention" urgent />
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search questions..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter size={18} />
                Filter
              </button>
              <button 
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors"
              >
                <Plus size={18} />
                Add Question
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4 w-16">ID</th>
                  <th className="px-6 py-4">Question Text</th>
                  <th className="px-6 py-4 w-48">Domain</th>
                  <th className="px-6 py-4 w-32">Type</th>
                  <th className="px-6 py-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockQuestions.map((q) => (
                  <TableRow 
                    key={q.id}
                    question={q}
                    onClick={() => handleEditQuestion(q)}
                  />
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
              <span>Showing 1-5 of 1,240 questions</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Prev</button>
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <QuestionEditor 
        isOpen={isEditorOpen}
        question={selectedQuestion}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveQuestion}
      />
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ label, value, change, urgent = false }: { label: string, value: string, change: string, urgent?: boolean }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-slate-500 text-sm font-medium mb-2">{label}</h3>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-slate-900">{value}</span>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${urgent ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
        {change}
      </span>
    </div>
  </div>
);

const TableRow: React.FC<{ question: Question, onClick: () => void }> = ({ question, onClick }) => (
  <tr 
    onClick={onClick}
    className="hover:bg-slate-50 transition-colors group cursor-pointer"
  >
    <td className="px-6 py-4 text-slate-500 font-mono text-sm">#{question.id}</td>
    <td className="px-6 py-4">
      <p className="font-medium text-slate-900 line-clamp-1">{question.text}</p>
    </td>
    <td className="px-6 py-4">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
        {question.domain}
      </span>
    </td>
    <td className="px-6 py-4 text-slate-500 text-sm">{question.type}</td>
    <td className="px-6 py-4 text-right">
      <button className="text-slate-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition-colors">
        <MoreVertical size={18} />
      </button>
    </td>
  </tr>
);
