import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types/user';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirebaseActive: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  sendVerificationEmail: () => Promise<{ success: boolean; message: string }>;
  loginAsDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  uid: 'usr-cyber-owner-01',
  email: 'cyber.admin@securelock.io',
  displayName: 'Chief Defense Officer',
  emailVerified: true,
  registeredAt: '2026-01-15T08:00:00.000Z',
  lastLoginAt: new Date().toISOString(),
  isDemoUser: true,
};

const LOCAL_STORAGE_AUTH_KEY = 'securelock_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. If Firebase is active and auth is initialized, subscribe to auth state
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Authorized Owner',
            emailVerified: firebaseUser.emailVerified,
            registeredAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
            lastLoginAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
            isDemoUser: false,
          });
        } else {
          // If no Firebase user, default to demo owner so the site is 100% public for visitors without a login screen
          const stored = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch (e) {
              setUser(DEMO_USER);
            }
          } else {
            setUser(DEMO_USER);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // 2. Demo / Standalone Mode
      const stored = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(DEMO_USER);
        }
      } else {
        // Default to logged-in demo user for immediate review capability
        setUser(DEMO_USER);
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(DEMO_USER));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, pass);
        setUser({
          uid: userCred.user.uid,
          email: userCred.user.email || email,
          displayName: userCred.user.displayName || 'Authorized Owner',
          emailVerified: userCred.user.emailVerified,
          registeredAt: userCred.user.metadata.creationTime || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isDemoUser: false,
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Authentication failed' };
      }
    } else {
      // Mock login validation
      if (!email.includes('@') || pass.length < 6) {
        return { success: false, error: 'Invalid email address or password too short (min 6 chars).' };
      }
      const loggedUser: UserProfile = {
        uid: 'usr-' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: email.split('@')[0],
        emailVerified: true,
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isDemoUser: true,
      };
      setUser(loggedUser);
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(loggedUser));
      return { success: true };
    }
  };

  const register = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, pass);
        // Dispatch verification email
        await firebaseSendEmailVerification(userCred.user);
        setUser({
          uid: userCred.user.uid,
          email: userCred.user.email || email,
          displayName: userCred.user.displayName || 'Authorized Owner',
          emailVerified: false,
          registeredAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isDemoUser: false,
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed' };
      }
    } else {
      if (!email.includes('@') || pass.length < 6) {
        return { success: false, error: 'Please enter a valid email and a password of at least 6 characters.' };
      }
      const newUser: UserProfile = {
        uid: 'usr-' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: email.split('@')[0],
        emailVerified: false,
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isDemoUser: true,
      };
      setUser(newUser);
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(newUser));
      return { success: true };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (isFirebaseConfigured && auth) {
      try {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        setUser({
          uid: res.user.uid,
          email: res.user.email || '',
          displayName: res.user.displayName || 'Authorized Owner',
          emailVerified: res.user.emailVerified,
          registeredAt: res.user.metadata.creationTime || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isDemoUser: false,
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Google Sign-in failed' };
      }
    } else {
      const googleUser: UserProfile = {
        uid: 'usr-google-owner-02',
        email: 'google.defense@securelock.io',
        displayName: 'Google Authenticated Owner',
        emailVerified: true,
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isDemoUser: true,
      };
      setUser(googleUser);
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(googleUser));
      return { success: true };
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    setUser(DEMO_USER);
  };

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSendPasswordResetEmail(auth, email);
        return { success: true, message: `Password reset email dispatched to ${email}` };
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to send reset email' };
      }
    } else {
      return { success: true, message: `Demo Mode: Password reset link generated for ${email}. Check inbox simulation.` };
    }
  };

  const sendVerificationEmail = async () => {
    if (isFirebaseConfigured && auth?.currentUser) {
      try {
        await firebaseSendEmailVerification(auth.currentUser);
        return { success: true, message: 'Verification link sent to your registered address.' };
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to send verification email' };
      }
    } else {
      if (user) {
        setUser({ ...user, emailVerified: true });
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify({ ...user, emailVerified: true }));
      }
      return { success: true, message: 'Verification link sent (simulated). Account marked as verified!' };
    }
  };

  const loginAsDemoUser = () => {
    setUser(DEMO_USER);
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(DEMO_USER));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseActive: isFirebaseConfigured,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        sendVerificationEmail,
        loginAsDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
