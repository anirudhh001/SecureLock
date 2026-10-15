import React from 'react';
import { Shield, Lock, FileCode, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050811] border-t border-slate-900 py-6 px-6 lg:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-500" />
          <span className="font-semibold text-slate-400">SecureLock Defense System</span>
          <span className="text-slate-600">|</span>
          <span>College Cybersecurity Capstone Project (2026)</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Owner Authorization Verified
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-cyan-500" /> End-to-End Cryptographic Handshake
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <FileCode className="w-3.5 h-3.5 text-amber-500" /> Android 14 Policy Compliant
          </span>
        </div>

      </div>
    </footer>
  );
};
