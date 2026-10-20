import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Check, CheckCircle2 } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password Strength Calculations
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const strengthScore = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (strengthScore < 3) {
      setError('Password is too weak. Please include at least 8 characters with a mix of letters, numbers, and symbols.');
      return;
    }

    if (!consentChecked) {
      setError('You must accept the Ethical Device Ownership terms before registering.');
      return;
    }

    setLoading(true);
    const res = await register(email, password);
    setLoading(false);

    if (res.success) {
      onNavigate('verify-email');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Background Subtle Ambient */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/[0.07] rounded-full blur-3xl pointer-events-none" />

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
            Enroll Verified Device Owner Account
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#151E2E] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          
          <div>
            <h2 className="text-lg font-bold text-white">Create Owner Credentials</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Securely register to manage and protect your personal Android hardware.
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
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@domain.com"
                  className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Master Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1 h-1 w-full bg-[#0B1120] rounded-full overflow-hidden">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-full flex-1 transition-all ${
                          lvl <= strengthScore 
                            ? strengthScore <= 2 ? 'bg-rose-500' : strengthScore <= 4 ? 'bg-amber-500' : 'bg-emerald-500'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
                    <span className={hasMinLength ? 'text-emerald-400' : ''}>8+ chars</span>
                    <span className={hasUpperCase && hasLowerCase ? 'text-emerald-400' : ''}>mixed case</span>
                    <span className={hasNumber ? 'text-emerald-400' : ''}>number</span>
                    <span className={hasSpecial ? 'text-emerald-400' : ''}>symbol</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Confirm Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Ethical Compliance Consent */}
            <div className="p-3 bg-[#0B1120] border border-white/[0.08] rounded-xl text-xs space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-300 leading-relaxed">
                  I confirm that I am registering only hardware that I personally own and authorize under Android Device Administration policies.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-btn-primary w-full text-xs font-bold py-2.5 shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? 'Creating Credentials...' : 'Register Owner Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Already have an owner account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-blue-400 hover:underline font-semibold"
            >
              Sign In
            </button>
          </div>

        </div>

        {/* Security Notice */}
        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Device Administration API Compliance Verified</span>
        </div>

      </div>

    </div>
  );
};
