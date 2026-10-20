import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getStoredFirebaseConfig, 
  saveStoredFirebaseConfig, 
  clearStoredFirebaseConfig, 
  type FirebaseCustomConfig 
} from '../firebase/config';
import { 
  User, 
  Database, 
  ShieldCheck, 
  Key, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink,
  Lock
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const AccountSettingsPage: React.FC<Props> = ({ onNavigate }) => {
  const { user, isFirebaseActive } = useAuth();

  const storedConfig = getStoredFirebaseConfig();
  const [apiKey, setApiKey] = useState(storedConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(storedConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState(storedConfig?.authDomain || '');
  const [storageBucket, setStorageBucket] = useState(storedConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(storedConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(storedConfig?.appId || '');

  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      alert('API Key and Project ID are mandatory for live Firebase connection.');
      return;
    }

    const newCfg: FirebaseCustomConfig = {
      apiKey,
      authDomain: authDomain || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: storageBucket || `${projectId}.appspot.com`,
      messagingSenderId: messagingSenderId || '1234567890',
      appId: appId || '1:1234567890:web:abcdef',
    };

    saveStoredFirebaseConfig(newCfg);
  };

  const handleResetToSimulator = () => {
    if (confirm('Reset to Standalone Interactive Simulator Mode? Page will refresh.')) {
      clearStoredFirebaseConfig();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
            SYSTEM PREFERENCES
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Account & Backend Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure verified owner credentials, custom Firebase keys, and cryptographic policy settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Firebase Configuration & Profile */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Owner Profile Card */}
          <div className="cyber-card p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/[0.08]">
              <User className="w-4 h-4 text-blue-400" />
              <span>Verified Owner Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Registered Email</span>
                <p className="font-semibold text-white truncate">{user?.email || 'owner@securelock.io'}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 pt-1">
                  <CheckCircle2 className="w-3 h-3" /> Email Identity Verified
                </div>
              </div>

              <div className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Owner UID</span>
                <p className="font-mono text-blue-400 font-semibold truncate">{user?.uid || 'usr-cyber-owner-01'}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                  <Lock className="w-3 h-3 text-blue-400" /> Authorized Admin Authority
                </div>
              </div>
            </div>
          </div>

          {/* Firebase Configuration Form */}
          <form onSubmit={handleSaveFirebase} className="cyber-card p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Firebase Cloud Backend Credentials
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isFirebaseActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              }`}>
                {isFirebaseActive ? 'LIVE CLOUD CONNECTED' : 'INTERACTIVE SIMULATOR ACTIVE'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              SecureLock seamlessly operates in self-contained simulator mode or can connect directly to your own Firebase Firestore project.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Firebase API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSyBxxxx..."
                  className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="securelock-capstone"
                  className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Auth Domain (Optional)
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="project.firebaseapp.com"
                  className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Storage Bucket (Optional)
                </label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  placeholder="project.appspot.com"
                  className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="submit"
                className="cyber-btn-primary flex-1 text-xs font-bold py-2.5"
              >
                <Save className="w-4 h-4" />
                <span>Save & Connect Firebase</span>
              </button>

              <button
                type="button"
                onClick={handleResetToSimulator}
                className="cyber-btn-secondary flex-1 text-xs font-semibold py-2.5"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Reset to Simulator Mode</span>
              </button>
            </div>
          </form>

        </div>

        {/* Right Col: Capstone Architecture Specs */}
        <div className="space-y-6">
          <div className="cyber-card p-5 space-y-3 text-xs">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/[0.08]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Project MDC2026 Capstone Details</span>
            </h3>

            <div className="space-y-2.5 text-[11px] text-slate-400 leading-relaxed">
              <p>
                <strong className="text-slate-200">System Name:</strong> SecureLock Enterprise Device Defense
              </p>
              <p>
                <strong className="text-slate-200">Architecture:</strong> Dual-Node Realtime Architecture (Web Dashboard + Android Companion Daemon + Firebase Cloud Firestore)
              </p>
              <p>
                <strong className="text-slate-200">Security Standard:</strong> Android DevicePolicyManager API Level 34 zero-exploit compliance.
              </p>
              <p>
                <strong className="text-slate-200">Cryptographic Channel:</strong> TLS 1.3 Transport Encryption with SHA-256 integrity tokens.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
