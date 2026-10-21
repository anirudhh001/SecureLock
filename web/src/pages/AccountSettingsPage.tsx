import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Lock,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const AccountSettingsPage: React.FC<Props> = ({ onNavigate }) => {
  const { user, isFirebaseActive } = useAuth();
  const { theme, setTheme } = useTheme();

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
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure appearance theme, verified owner credentials, and optional Firebase keys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Appearance / Theme Settings */}
          <div className="cyber-card p-6 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/[0.06]">
              <Sun className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Appearance & Theme</span>
            </h3>

            <div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                Select your preferred interface color theme. Changes apply across the dashboard instantly.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* Light Theme Card */}
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    theme === 'light' 
                      ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/50' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </div>
                    {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900">Light Mode</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Clean SaaS aesthetic with soft neutral background.</p>
                </button>

                {/* Dark Theme Card */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    theme === 'dark' 
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-[#182235]' 
                      : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] bg-white dark:bg-[#141D2E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                      <Moon className="w-4 h-4 text-blue-400" />
                    </div>
                    {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Dark Mode</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Restrained deep navy palette for night monitoring.</p>
                </button>
              </div>
            </div>
          </div>

          {/* Owner Profile Card */}
          <div className="cyber-card p-6 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/[0.06]">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Owner Account</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.06] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Registered Email</span>
                <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.email || 'owner@securelock.io'}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 pt-1">
                  <CheckCircle2 className="w-3 h-3" /> Identity Verified
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.06] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Owner UID</span>
                <p className="font-mono text-blue-600 dark:text-blue-400 font-semibold truncate">{user?.uid || 'usr-cyber-owner-01'}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1">
                  <Lock className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Device Admin Authority
                </div>
              </div>
            </div>
          </div>

          {/* Firebase Configuration Form */}
          <form onSubmit={handleSaveFirebase} className="cyber-card p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Firebase Cloud Backend Credentials
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isFirebaseActive 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' 
                  : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
              }`}>
                {isFirebaseActive ? 'Live Cloud Connected' : 'Simulator Mode Active'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              SecureLock operates smoothly in standalone interactive simulator mode or connects directly to live Firebase Firestore.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Firebase API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSyBxxxx..."
                  className="w-full bg-white dark:bg-[#101827] border border-slate-200 dark:border-white/[0.1] rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="securelock-capstone"
                  className="w-full bg-white dark:bg-[#101827] border border-slate-200 dark:border-white/[0.1] rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Auth Domain (Optional)
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="project.firebaseapp.com"
                  className="w-full bg-white dark:bg-[#101827] border border-slate-200 dark:border-white/[0.1] rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Storage Bucket (Optional)
                </label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  placeholder="project.appspot.com"
                  className="w-full bg-white dark:bg-[#101827] border border-slate-200 dark:border-white/[0.1] rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
              <button
                type="submit"
                className="cyber-btn-primary flex-1 text-xs font-semibold py-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Credentials</span>
              </button>

              <button
                type="button"
                onClick={handleResetToSimulator}
                className="cyber-btn-secondary flex-1 text-xs py-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span>Reset to Simulator</span>
              </button>
            </div>
          </form>

        </div>

        {/* Right Col: Architecture Overview */}
        <div className="space-y-6">
          <div className="cyber-card p-5 space-y-3 text-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/[0.06]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Project MDC2026 Architecture</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong className="text-slate-900 dark:text-white">Platform:</strong> SecureLock SaaS Defense Console
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Architecture:</strong> Dual-Node Architecture (Web Application + Android Companion Daemon + Firebase Cloud)
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Design Style:</strong> Modern Minimal SaaS (Light & Dark Mode)
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Encryption:</strong> TLS 1.3 Transport Security
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
