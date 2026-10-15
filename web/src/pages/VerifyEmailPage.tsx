import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';

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
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        
        <div className="bg-[#0b1120]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto shadow-lg shadow-cyan-950/50">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white">Verify Your Owner Email</h2>
            <p className="text-xs text-slate-400">
              A cryptographic confirmation link was dispatched to:
            </p>
            <p className="text-sm font-semibold text-cyan-300 font-mono">
              {user?.email || 'owner@domain.com'}
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-left space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero-Trust Owner Identification</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Email verification prevents unauthorized device linking and ensures only the verified owner can initiate Lost Mode overrides and siren broadcasts.
            </p>
          </div>

          {statusMessage && (
            <div className="p-3 bg-cyan-950/60 border border-cyan-800/80 rounded-xl text-xs text-cyan-200">
              {statusMessage}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2"
            >
              <span>I Have Verified / Continue to Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Dispatching Email...' : 'Resend Verification Email'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
