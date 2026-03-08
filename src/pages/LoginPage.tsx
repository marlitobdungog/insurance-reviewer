import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Shield, Building2, Landmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would validate credentials here
    navigate('/start');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 overflow-hidden max-w-5xl w-full grid md:grid-cols-2 min-h-[600px]">
        
        {/* Left Side - Image & Branding */}
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-400/40 to-orange-900/90 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
            alt="Office meeting" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 h-full flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Master Your License</h2>
            <p className="text-orange-100 text-lg leading-relaxed max-w-md">
              Access industry-leading prep materials and practice exams designed for future agents.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-12 flex flex-col justify-center">
          <div className="mb-10">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-600/20">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Agent Exam Prep</h1>
            <p className="text-slate-500">Sign in to continue your license practice</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. agent@insurance.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-600 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm font-semibold text-orange-600 hover:text-orange-700">Forgot Password?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-600 placeholder:text-slate-400 pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="remember" className="text-sm text-slate-600 select-none cursor-pointer">
                Remember this device
              </label>
            </div>

            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
              Sign In
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-orange-600 font-bold hover:text-orange-700 transition-colors">
                Register now
              </Link>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Trusted By</p>
            <div className="flex gap-6 text-slate-400">
              <Landmark size={24} />
              <Shield size={24} />
              <Building2 size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
