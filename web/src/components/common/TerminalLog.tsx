import React, { useState } from 'react';
import { Terminal, Copy, Check, Trash2, ShieldCheck } from 'lucide-react';

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
    <div className="bg-[#050811] border border-cyan-950/60 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* Terminal Header */}
      <div className="bg-[#0a0f1d] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-slate-400 font-semibold tracking-wider flex items-center gap-1.5 ml-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            SECURELOCK_COMMAND_AUDIT_LOG
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="flex items-center gap-1 text-[11px] text-emerald-400/90 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            <ShieldCheck className="w-3 h-3" /> TLS 1.3 VERIFIED
          </span>
          <button
            onClick={copyToClipboard}
            className="p-1 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors"
            title="Copy audit log"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 max-h-60 overflow-y-auto space-y-1.5 text-slate-300">
        {logs.length === 0 ? (
          <div className="text-slate-500 italic">No command audit logs recorded yet.</div>
        ) : (
          logs.map((log, index) => {
            let color = 'text-slate-300';
            if (log.includes('[CRITICAL]') || log.includes('[ERROR]') || log.includes('UNAUTHORIZED')) {
              color = 'text-rose-400 font-semibold';
            } else if (log.includes('[HIGH]') || log.includes('[ALARM_TRIGGER]')) {
              color = 'text-amber-400';
            } else if (log.includes('[COMMAND]') || log.includes('[ACK_RECEIPT]')) {
              color = 'text-cyan-400';
            } else if (log.includes('[SECURITY_ALERT]')) {
              color = 'text-yellow-400';
            } else if (log.includes('[SYSTEM]') || log.includes('[ENROLLMENT]')) {
              color = 'text-emerald-400';
            }

            return (
              <div key={index} className={`leading-relaxed break-all ${color}`}>
                {log}
              </div>
            );
          })
        )}
        <div className="flex items-center gap-1 text-cyan-500/70 pt-1">
          <span className="animate-pulse">❯</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Live Cryptographic Channel Listening...</span>
        </div>
      </div>
    </div>
  );
};
