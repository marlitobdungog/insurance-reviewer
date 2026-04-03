import React, { useEffect, useMemo, useState } from 'react';
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
import { Question } from '../data/questions';
import { QuestionEditor } from '../components/QuestionEditor';

export const AdminPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoadError('');
      setIsLoading(true);
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      setQuestions(Array.isArray(data.questions) ? data.questions : []);
    } catch (error) {
      console.error(error);
      setLoadError('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const filteredQuestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return questions;
    }

    return questions.filter((question) => {
      return (
        question.text.toLowerCase().includes(query) ||
        question.domain.toLowerCase().includes(query) ||
        String(question.id).includes(query)
      );
    });
  }, [questions, searchTerm]);

  const domainCount = new Set(questions.map((question) => question.domain)).size;

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsEditorOpen(true);
  };

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setIsEditorOpen(true);
  };

  const handleSaveQuestion = async (updatedQuestion: Question) => {
    try {
      setIsSaving(true);

      const isEditing = selectedQuestion !== null;
      const endpoint = isEditing ? `/api/questions/${selectedQuestion.id}` : '/api/questions';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuestion),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save question');
      }

      setQuestions((currentQuestions) => {
        if (isEditing) {
          return currentQuestions.map((question) =>
            question.id === data.id ? data : question
          );
        }

        return [...currentQuestions, data].sort((left, right) => left.id - right.id);
      });

      setIsEditorOpen(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : 'Failed to save question');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete question');
      }

      setQuestions((currentQuestions) =>
        currentQuestions.filter((question) => question.id !== questionId)
      );
      setIsEditorOpen(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : 'Failed to delete question');
    } finally {
      setIsDeleting(false);
    }
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
            <StatCard label="Total Questions" value={String(questions.length)} change="Live from database" />
            <StatCard label="Active Domains" value={String(domainCount)} change="Based on current bank" />
            <StatCard label="Search Results" value={String(filteredQuestions.length)} change={searchTerm ? 'Filtered view' : 'All questions shown'} urgent={Boolean(searchTerm)} />
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
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
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">Loading questions...</td>
                  </tr>
                ) : loadError ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-red-600">{loadError}</td>
                  </tr>
                ) : filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">No questions found.</td>
                  </tr>
                ) : filteredQuestions.map((q) => (
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
              <span>Showing {filteredQuestions.length} of {questions.length} questions</span>
              <div className="flex gap-2">
                <button onClick={fetchQuestions} className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Refresh</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <QuestionEditor 
        isOpen={isEditorOpen}
        question={selectedQuestion}
        isSaving={isSaving}
        isDeleting={isDeleting}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveQuestion}
        onDelete={handleDeleteQuestion}
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
