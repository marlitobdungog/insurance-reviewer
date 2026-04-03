/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuizPage } from './pages/QuizPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ExamStartPage } from './pages/ExamStartPage';
import { AgentDashboardPage } from './pages/AgentDashboardPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const AdminRoute: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;
  return <AdminPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<AgentDashboardPage />} />
          <Route path="/start" element={<ExamStartPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
