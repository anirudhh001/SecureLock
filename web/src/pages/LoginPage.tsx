import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<Props> = ({ onNavigate }) => {
  const { login, loginWithGoogle, loginAsDemoUser, resetPassword } = useAuth();
  
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
    <div className="min-h-screen bg-[#0B1120] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/[0.07] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20 mb-3.5">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            SECURE<span className="text-blue-400">LOCK</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Enterprise Device Defense & Lost Mode Console
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#151E2E] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          
          <div>
            <h2 className="text-lg font-bold text-white">Owner Portal Sign In</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your verified credentials to access device telemetry.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Owner Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@domain.com"
                  className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Master Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-btn-primary w-full text-xs font-bold py-2.5 shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Authenticate & Enter Console'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Alternative Sign-In Options */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
            
            {/* Quick Demo Sign-in for immediate evaluation */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Instant Review Login (Pre-configured Owner)</span>
            </button>

            {/* Google Sign-In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="cyber-btn-secondary w-full text-xs py-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          <div className="text-center text-xs text-slate-400">
            Don't have a registered account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-blue-400 hover:underline font-semibold"
            >
              Register New Owner
            </button>
          </div>

        </div>

        {/* Security Notice */}
        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Legitimate Android Device Admin Protocol • Never Bypasses OS Security</span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151E2E] border border-white/[0.1] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Reset Master Password</h3>
            <p className="text-xs text-slate-400">
              Enter your registered owner email to receive a secure recovery link.
            </p>

            {resetMessage && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-200">
                {resetMessage}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="registered@email.com"
                className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="cyber-btn-secondary text-xs"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="cyber-btn-primary text-xs font-semibold"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
