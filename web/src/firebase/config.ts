import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const LOCAL_STORAGE_KEY = 'securelock_firebase_config';

export function getStoredFirebaseConfig(): FirebaseCustomConfig | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored Firebase config:', e);
  }
  return null;
}

export function saveStoredFirebaseConfig(config: FirebaseCustomConfig): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  window.location.reload();
}

export function clearStoredFirebaseConfig(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  window.location.reload();
}

// 1. Check environment variables
const envConfig: FirebaseCustomConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const userStoredConfig = getStoredFirebaseConfig();
const activeConfig = (userStoredConfig && userStoredConfig.apiKey) ? userStoredConfig : envConfig;

export const isFirebaseConfigured = Boolean(activeConfig.apiKey && activeConfig.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('[SecureLock] Firebase initialized successfully with project:', activeConfig.projectId);
  } catch (err) {
    console.warn('[SecureLock] Failed to initialize Firebase with provided credentials. Falling back to Live Simulator Mode.', err);
  }
} else {
  console.info('[SecureLock] Running in Standalone Live Cybersecurity Simulator Mode. (Configure Firebase in Settings anytime)');
}

export { app, auth, db };
