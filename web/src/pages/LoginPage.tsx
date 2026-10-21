import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, Sun, Moon } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<Props> = ({ onNavigate }) => {
  const { login, loginWithGoogle, loginAsDemoUser, resetPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      onNavigate('dashboard');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      onNavigate('dashboard');
    } else {
      setError(res.error || 'Google Sign-in failed.');
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoUser();
    onNavigate('dashboard');
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    const res = await resetPassword(forgotEmail);
    setResetMessage(res.message);
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
            SecureLock
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Device Defense & Lost Mode Console
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

          {/* Quick Demo Access */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-600/10 dark:hover:bg-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Open Live Dashboard (No Login Needed)</span>
          </button>

          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-slate-200 dark:border-white/[0.08]" />
            <span className="bg-white dark:bg-[#141D2E] px-3 text-[11px] text-slate-400 absolute">or sign in</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-8 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-2 top-2"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cyber-btn-primary text-xs py-2 mt-1"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full cyber-btn-secondary text-xs py-2 flex items-center justify-center gap-2"
          >
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Register
            </button>
          </p>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#141D2E] rounded-xl border border-slate-200 dark:border-white/[0.1] max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Reset Password</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your email to receive a password reset link.
            </p>
            {resetMessage ? (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg">{resetMessage}</div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-xs text-slate-900 dark:text-white"
                  required
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="cyber-btn-secondary text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="cyber-btn-primary text-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
