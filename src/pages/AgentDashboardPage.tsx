import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, PlayCircle, ClipboardCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AgentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">Agent Portal</p>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back{user?.fullName ? `, ${user.fullName}` : ''}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-3">
        <DashboardCard
          icon={<PlayCircle className="text-orange-600" />}
          title="Start Practice"
          description="Launch a full simulated exam and track your performance."
          actionLabel="Begin Exam"
          onClick={() => navigate('/start')}
        />

        <DashboardCard
          icon={<ClipboardCheck className="text-orange-600" />}
          title="Continue Quiz"
          description="Jump into the question review screen and continue where you left off."
          actionLabel="Go to Quiz"
          onClick={() => navigate('/quiz')}
        />

        {user?.isAdmin && (
          <DashboardCard
            icon={<BookOpen className="text-orange-600" />}
            title="Admin Tools"
            description="Review and edit question bank entries in the admin section."
            actionLabel="Open Admin"
            onClick={() => navigate('/admin')}
          />
        )}
      </main>
    </div>
  );
};

const DashboardCard = ({
  icon,
  title,
  description,
  actionLabel,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
}) => (
  <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">{icon}</div>
    <h2 className="text-lg font-bold text-slate-900 mb-2">{title}</h2>
    <p className="text-slate-600 text-sm leading-relaxed mb-6">{description}</p>
    <button
      onClick={onClick}
      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
    >
      {actionLabel}
    </button>
  </section>
);
