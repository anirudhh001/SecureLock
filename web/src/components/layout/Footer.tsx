import React from 'react';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0A0F1C] border-t border-slate-200 dark:border-white/[0.08] py-4 px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-slate-800 dark:text-slate-200">SecureLock Platform</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Device Defense & Lost Mode Control</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> End-to-End Encryption
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> TLS 1.3 Certified
          </span>
        </div>

      </div>
    </footer>
  );
};
