import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getStoredFirebaseConfig, 
  saveStoredFirebaseConfig, 
  clearStoredFirebaseConfig, 
  isFirebaseConfigured,
  type FirebaseCustomConfig 
} from '../firebase/config';
import { 
  Settings, 
  User, 
  Database, 
  ShieldCheck, 
  Key, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Lock,
  Smartphone
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

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

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
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <span>ACCOUNT & BACKEND SETTINGS</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure verified owner credentials, custom Firebase keys, and cryptographic policy settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Firebase Configuration & Profile */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Owner Profile Card */}
          <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Verified Owner Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Registered Email</span>
                <p className="font-semibold text-white truncate">{user?.email || 'owner@securelock.io'}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 pt-1">
                  <CheckCircle2 className="w-3 h-3" /> Email Identity Verified
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Owner UID</span>
                <p className="font-mono text-cyan-300 font-semibold">{user?.uid || 'usr-cyber-owner-01'}</p>
                <p className="text-[10px] text-slate-400 pt-1">Linked to Firestore Security Rules</p>
              </div>
            </div>
          </div>

          {/* Firebase Connection & Credentials */}
          <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Firebase Cloud Infrastructure
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Connect your own Firebase project or run seamlessly in Simulator Mode.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  isFirebaseActive 
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                    : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                }`}>
                  {isFirebaseActive ? 'FIREBASE LIVE' : 'INTERACTIVE SIMULATOR'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveFirebase} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Firebase API Key (VITE_FIREBASE_API_KEY)
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Project ID (VITE_FIREBASE_PROJECT_ID)
                  </label>
                  <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="securelock-capstone-2026"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Auth Domain
                  </label>
                  <input
                    type="text"
                    value={authDomain}
                    onChange={(e) => setAuthDomain(e.target.value)}
                    placeholder="project-id.firebaseapp.com"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Storage Bucket
                  </label>
                  <input
                    type="text"
                    value={storageBucket}
                    onChange={(e) => setStorageBucket(e.target.value)}
                    placeholder="project-id.appspot.com"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>Connect Firebase Project</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToSimulator}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Live Simulator</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Col: Android Security & Ethics Matrix */}
        <div className="space-y-6">
          <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Android Security Boundaries
            </h3>

            <p className="text-slate-400 leading-relaxed text-[11px]">
              This project is designed as an honest, legitimate cybersecurity application demonstrating authorized owner device defense.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  ✓ Permitted APIs
                </span>
                <p className="text-[10px] text-slate-300 mt-1">
                  DeviceAdminReceiver lockNow(), FusedLocationProvider, NotificationManager, Foreground Service.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="font-semibold text-rose-400 flex items-center gap-1">
                  ✕ Strictly Forbidden
                </span>
                <p className="text-[10px] text-slate-300 mt-1">
                  Bypassing user consent, rooting, spying, stealth microphone activation, or bypassing Android lock screen without user PIN.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
