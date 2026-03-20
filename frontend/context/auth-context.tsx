"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { onSnapshot, query, collection, where, limit, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AuthModal } from "@/components/auth-modal";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  balance: number;
  avatarUrl?: string | null;
  role: "USER" | "ADMIN";
}

interface Notification {
  id: string;
  status?: string;
  notified?: boolean;
  userId?: string;
  createdAt?: any;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  notifications: Notification[];
  logout: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  notifications: [],
  logout: async () => {},
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser?.email) {
        try {
          const nameToSync = firebaseUser.displayName || firebaseUser.email.split('@')[0] || "User";
          const token = await firebaseUser.getIdToken();
          
          await fetch('/api/auth/sync', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              authId: firebaseUser.uid,
              name: nameToSync,
              email: firebaseUser.email,
              phoneNumber: firebaseUser.phoneNumber || ""
            })
          }).catch(console.error);

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

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "payments"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        // Notifications list handles the reactive UI update for the bell icon
        setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        console.error("Firebase Snapshot Error (Listening for payments):", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

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
    <AuthContext.Provider value={{ user, profile, loading, notifications, logout, openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
