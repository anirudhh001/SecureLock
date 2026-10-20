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
    <div className="min-h-screen bg-[#0B1120] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Background Subtle Ambient */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/[0.07] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        <div className="bg-[#151E2E] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-blue-400 mx-auto shadow-sm">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white">Verify Your Owner Email</h2>
            <p className="text-xs text-slate-400">
              A cryptographic confirmation link was dispatched to:
            </p>
            <p className="text-sm font-semibold text-blue-300 font-mono">
              {user?.email || 'owner@domain.com'}
            </p>
          </div>

          <div className="p-4 bg-[#0B1120] border border-white/[0.06] rounded-xl text-left space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero-Trust Owner Identification</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Email verification prevents unauthorized device linking and ensures only the verified owner can initiate Lost Mode overrides and siren broadcasts.
            </p>
          </div>

          {statusMessage && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-200">
              {statusMessage}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="cyber-btn-primary w-full text-xs font-bold py-2.5 shadow-md shadow-blue-500/20"
            >
              <span>I Have Verified / Continue to Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="cyber-btn-secondary w-full text-xs font-semibold py-2.5 disabled:opacity-50"
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
