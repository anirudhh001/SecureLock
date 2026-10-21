import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const VerifyEmailPage: React.FC<Props> = ({ onNavigate }) => {
  const { user, sendVerificationEmail } = useAuth();
  const [resending, setResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleResend = async () => {
    setResending(true);
    const res = await sendVerificationEmail();
    setResending(false);
    setStatusMessage(res.message);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0A0F1C] text-[#111827] dark:text-[#F9FAFB] flex flex-col justify-center items-center px-4 py-12 relative transition-colors duration-200">
      
      <div className="w-full max-w-sm">
        
        <div className="bg-white dark:bg-[#141D2E] border border-slate-200 dark:border-white/[0.08] rounded-xl p-6 sm:p-7 shadow-xs text-center space-y-5">
          
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto">
            <Mail className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Verify Your Owner Email</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A verification link was dispatched to:
            </p>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono">
              {user?.email || 'owner@domain.com'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] rounded-lg text-left space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Identity Verification</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Email verification ensures that only the verified owner can initiate Lost Mode overrides and alarm broadcasts.
            </p>
          </div>

          {statusMessage && (
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-lg text-xs">
              {statusMessage}
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="cyber-btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="cyber-btn-secondary w-full text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Sending...' : 'Resend Email'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
