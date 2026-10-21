import React, { useState } from 'react';
import { Terminal, Copy, Check, ShieldCheck } from 'lucide-react';

interface Props {
  logs: string[];
}

export const TerminalLog: React.FC<Props> = ({ logs }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 dark:bg-[#111827] text-slate-200 border border-slate-200 dark:border-white/[0.08] rounded-xl overflow-hidden shadow-xs font-mono text-xs">
      {/* Terminal Header */}
      <div className="bg-slate-950/80 dark:bg-[#151E2E] px-4 py-2.5 border-b border-slate-800 dark:border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-slate-300 font-medium tracking-wide flex items-center gap-1.5 ml-2 text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            Audit Console
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> TLS 1.3
          </span>
          <button
            onClick={copyToClipboard}
            className="p-1 rounded hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
            title="Copy audit log"
            aria-label="Copy audit log"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-3.5 max-h-60 overflow-y-auto space-y-1 text-slate-300 text-[11px] leading-relaxed">
        {logs.length === 0 ? (
          <div className="text-slate-500 italic py-1">No command audit logs recorded yet.</div>
        ) : (
          logs.map((log, index) => {
            let color = 'text-slate-300';
            if (log.includes('[CRITICAL]') || log.includes('[ERROR]') || log.includes('UNAUTHORIZED')) {
              color = 'text-rose-400 font-semibold';
            } else if (log.includes('[HIGH]') || log.includes('[ALARM_TRIGGER]')) {
              color = 'text-amber-400';
            } else if (log.includes('[COMMAND]') || log.includes('[ACK_RECEIPT]')) {
              color = 'text-blue-400';
            } else if (log.includes('[SECURITY_ALERT]')) {
              color = 'text-amber-300';
            } else if (log.includes('DEVICE_REGISTERED') || log.includes('SUCCESS') || log.includes('AUTHENTICATED')) {
              color = 'text-emerald-400';
            }

            return (
              <div key={index} className="flex items-start gap-2 hover:bg-white/[0.04] px-1 py-0.5 rounded">
                <span className="text-slate-600 select-none text-[10px]">{String(index + 1).padStart(2, '0')}</span>
                <span className={color}>{log}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
