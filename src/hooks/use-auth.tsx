
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User 
} from 'firebase/auth';
import { auth, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateUserProfile: (data: { displayName?: string; photoFile?: File }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  
  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  }
  
  const updateUserProfile = async (data: { displayName?: string; photoFile?: File }) => {
    if (!auth.currentUser) {
      throw new Error("Nenhum usuário autenticado encontrado.");
    }
  
    const profileUpdate: { displayName?: string, photoURL?: string } = {};
  
    if (data.photoFile) {
      const filePath = `profile-pictures/${auth.currentUser.uid}/${data.photoFile.name}`;
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, data.photoFile);
      profileUpdate.photoURL = await getDownloadURL(snapshot.ref);
    }
  
    if (data.displayName !== undefined) {
      profileUpdate.displayName = data.displayName;
    }
  
    await updateProfile(auth.currentUser, profileUpdate);
  
    // Força a atualização do estado do usuário criando um novo objeto
    // para que o React detecte a mudança e re-renderize.
    if (auth.currentUser) {
      const updatedUser: User = { ...auth.currentUser };
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
