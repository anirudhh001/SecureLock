import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Lock, Mail, User, AlertCircle, CheckCircle2, Sun, Moon } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await register(email, password);
    setLoading(false);

    if (res.success) {
      onNavigate('dashboard');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0A0F1C] text-[#111827] dark:text-[#F9FAFB] flex flex-col justify-center items-center px-4 py-12 relative transition-colors duration-200">
      
      {/* Theme Toggle Top Right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-[#141D2E] border border-slate-200 dark:border-white/[0.08] transition-all"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>

      <div className="w-full max-w-sm space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-xs mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create Owner Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Register your SecureLock security workspace
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#141D2E] rounded-xl p-6 sm:p-7 border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Security Admin"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cyber-btn-primary text-xs py-2 mt-2"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Sign In
            </button>
          </p>

        </div>

      </div>

    </div>
  );
};
