"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthModal } from "@/components/auth-modal";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  balance: number;
  avatarUrl?: string | null;
  role: "USER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser?.email) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const response = await fetch(`${apiUrl}/users/profile/${firebaseUser.email}`);
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
          } else {
             // Backend returned an error (e.g., 404 if not restarted)
             setProfile({
                id: firebaseUser.uid,
                email: firebaseUser.email,
                username: firebaseUser.displayName || 'User',
                balance: 0,
                role: 'USER'
             });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfile({
             id: firebaseUser.uid,
             email: firebaseUser.email,
             username: firebaseUser.displayName || 'User',
             balance: 0,
             role: 'USER'
          });
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
