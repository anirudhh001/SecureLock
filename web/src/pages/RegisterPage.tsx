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
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Background Cyber Ambient */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-xl shadow-cyan-950/60 mb-4 ring-1 ring-cyan-400/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            SECURE<span className="text-cyan-400">LOCK</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Enroll Verified Device Owner Account
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0b1120]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Create Owner Credentials</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Securely register to manage and protect your personal Android hardware.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
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
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 strong characters"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${
                      strengthScore <= 2 ? 'w-1/3 bg-rose-500' : strengthScore <= 4 ? 'w-2/3 bg-amber-500' : 'w-full bg-emerald-500'
                    }`} />
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
                    <span className={hasMinLength ? 'text-emerald-400 flex items-center gap-0.5' : ''}>
                      {hasMinLength && <Check className="w-2.5 h-2.5 inline" />} 8+ chars
                    </span>
                    <span className={hasUpperCase ? 'text-emerald-400 flex items-center gap-0.5' : ''}>
                      {hasUpperCase && <Check className="w-2.5 h-2.5 inline" />} Uppercase
                    </span>
                    <span className={hasNumber ? 'text-emerald-400 flex items-center gap-0.5' : ''}>
                      {hasNumber && <Check className="w-2.5 h-2.5 inline" />} Number
                    </span>
                    <span className={hasSpecial ? 'text-emerald-400 flex items-center gap-0.5' : ''}>
                      {hasSpecial && <Check className="w-2.5 h-2.5 inline" />} Symbol
                    </span>
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
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat master password"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Ethical Use & Ownership Consent Checkbox */}
            <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-400"
                />
                <span className="text-[11px] leading-relaxed text-slate-300">
                  I certify that I am the sole authorized owner of the Android smartphone(s) to be registered and agree to legitimate device-management protocols.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating Owner Account...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-cyan-400 hover:underline font-semibold"
            >
              Sign In Here
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
