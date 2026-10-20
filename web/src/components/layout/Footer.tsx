import React from 'react';
import { Shield, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1120] border-t border-white/[0.08] py-5 px-6 lg:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-slate-300">SecureLock Enterprise SOC</span>
          <span className="text-slate-600">|</span>
          <span>Final Year Cybersecurity Major Project (2026)</span>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <span className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Owner Authorization Verified
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-blue-400" /> TLS 1.3 Cryptographic Handshake
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Android Device Admin Compliant
          </span>
        </div>

      </div>
    </footer>
  );
};
