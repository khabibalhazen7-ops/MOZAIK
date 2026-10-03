import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithDemoAdmin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  loginWithEmail: async () => {},
  resetPassword: async () => {},
  loginWithGoogle: async () => {},
  loginWithDemoAdmin: () => {},
  logout: async () => {}
});

// Bootstrapped admin email from session
const ADMIN_EMAILS = ['mohrivai991@gmail.com', 'admin@mozaikstone.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [demoAdminActive, setDemoAdminActive] = useState<boolean>(() => {
    return localStorage.getItem('mozaik_demo_admin') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const email = currentUser.email?.toLowerCase() || '';
        const isEmailAdmin = ADMIN_EMAILS.includes(email);
        
        let isDocAdmin = false;
        try {
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          if (adminDoc.exists()) {
            isDocAdmin = true;
          } else if (isEmailAdmin) {
            // Provision into admins doc
            await setDoc(doc(db, 'admins', currentUser.uid), {
              email: currentUser.email,
              role: 'admin',
              createdAt: new Date().toISOString()
            });
            isDocAdmin = true;
          }
        } catch (e) {
          console.warn("Admin check notice:", e);
        }

        setIsAdmin(isEmailAdmin || isDocAdmin || demoAdminActive);
      } else {
        setIsAdmin(demoAdminActive);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [demoAdminActive]);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      // If user not found and it's our admin email, auto-register as initial admin
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        const lower = email.toLowerCase();
        if (ADMIN_EMAILS.includes(lower)) {
          try {
            await createUserWithEmailAndPassword(auth, email, pass);
            return;
          } catch (createErr) {
            // If already created, throw original error
            throw err;
          }
        }
      }
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google sign in error:", err);
      throw err;
    }
  };

  const loginWithDemoAdmin = () => {
    localStorage.setItem('mozaik_demo_admin', 'true');
    setDemoAdminActive(true);
    setIsAdmin(true);
  };

  const logout = async () => {
    localStorage.removeItem('mozaik_demo_admin');
    setDemoAdminActive(false);
    setIsAdmin(false);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: isAdmin || demoAdminActive,
        loading,
        loginWithEmail,
        resetPassword,
        loginWithGoogle,
        loginWithDemoAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
