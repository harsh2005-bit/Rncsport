"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, onSnapshot, query, collection, where, limit, orderBy } from "firebase/firestore";
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
  createdAt?: Date | string | number | null;
  [key: string]: unknown;
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
          
          // Sync user data to Firestore via internal API
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

        } catch (error) {
          console.error("Error during auth sync:", error);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Dedicated real-time profile listener
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userRef, 
      (snapshot: import("firebase/firestore").DocumentSnapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setProfile({
             id: user.uid,
             email: data.email || user.email || "",
             username: data.name || data.username || user.displayName || 'User',
             balance: data.balance || 0,
             role: data.role || 'USER'
          });
        } else {
           setProfile({
              id: user.uid,
              email: user.email || "",
              username: user.displayName || 'User',
              balance: 0,
              role: 'USER'
           });
        }
      },
      (error: Error) => {
        console.error("Firestore Profile Sync Error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

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
