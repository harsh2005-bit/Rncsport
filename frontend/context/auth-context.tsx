"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AuthModal } from "@/components/auth-modal";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  balance: number;
  avatarUrl?: string | null;
  role: "USER" | "ADMIN";
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  status?: string;
  read: boolean;
  createdAt: { seconds: number; nanoseconds: number } | Date | null;
  credentials?: {
    id: string;
    password: string;
    link: string;
  };
}


interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  notifications: AppNotification[];
  logout: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  markNotificationAsRead: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  notifications: [],
  logout: async () => {},
  openAuthModal: () => {},
  closeAuthModal: () => {},
  markNotificationAsRead: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  // Track previous notification IDs for Real-time Toast logic
  const prevNotifIds = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);

  // Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (!fbUser) {
        setNotifications([]);
        prevNotifIds.current = new Set();
        initialLoadRef.current = true;
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // REAL-TIME TOAST DETECTOR
  useEffect(() => {
    if (notifications.length === 0) return;

    // Skip the very first load to avoid spamming existing notifications on login
    if (initialLoadRef.current) {
      prevNotifIds.current = new Set(notifications.map(n => n.id));
      initialLoadRef.current = false;
      return;
    }

    // Find ONLY strictly new and unread notifications
    const newNotifications = notifications.filter(n => !prevNotifIds.current.has(n.id) && !n.read);

    if (newNotifications.length > 0) {
      newNotifications.forEach(n => {
        // 1. Play Sound Notification
        try {
          const audio = new Audio("/mixkit-software-interface-start-2574.wav");
          audio.volume = 0.5;
          audio.play().catch(e => console.warn("Auto-play blocked, interaction required", e));
        } catch (e) {
          console.error("Audio failed", e);
        }

        // 2. Show Custom Premium Toast
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-in fade-in slide-in-from-top-4' : 'animate-out fade-out slide-out-to-right-4'} pointer-events-auto flex w-full max-w-sm rounded-2xl bg-[#0b0b0b] border border-white/10 shadow-2xl p-5 gap-4 backdrop-blur-xl ring-1 ring-white/5`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
               n.title.includes('Approved') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
               n.title.includes('Rejected') ? 'bg-red-500/10 border-red-500/20 text-red-500' :
               'bg-primary/10 border-primary/20 text-primary'
            }`}>
               {n.title.includes('Approved') ? <CheckCircle2 size={24} /> : 
                n.title.includes('Rejected') ? <XCircle size={24} /> : 
                <Clock size={24} />}
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1">
               <h3 className="text-sm font-black text-white italic tracking-tighter uppercase font-cinzel">
                 {n.title}
               </h3>
               <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                 {n.message}
               </p>

               {/* SHOW CREDENTIALS IF APPLICABLE */}
               {n.credentials && (
                  <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/5 space-y-3">
                     <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg border border-white/5">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">ID / Pass</span>
                        <span className="text-[10px] font-bold text-primary tabular-nums tracking-wide">{n.credentials.id} / {n.credentials.password}</span>
                     </div>
                     <a 
                       href={n.credentials.link.startsWith('http') ? n.credentials.link : `https://${n.credentials.link}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       onClick={() => {
                         toast.dismiss(t.id);
                         markNotificationAsRead(n.id);
                       }}
                       className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                     >
                       Open Betting Panel <ExternalLink size={12} />
                     </a>
                  </div>
               )}
            </div>
          </div>
        ));
      });
    }

    // Update tracking Set
    prevNotifIds.current = new Set(notifications.map(n => n.id));
  }, [notifications]);

  // Notifications Listener
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const rawData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppNotification[];

      const filtered = rawData.filter(n => n.userId === user.uid);
      const sorted = filtered.sort((a, b) => {
         const t1 = (a.createdAt as { seconds: number })?.seconds || 0;
         const t2 = (b.createdAt as { seconds: number })?.seconds || 0;
         return t2 - t1;
      });


      setNotifications([...sorted]);
    });

    return () => unsub();
  }, [user?.uid]);

  const markNotificationAsRead = async (id: string) => {
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (e) {
      console.error("Error marking read", e);
    }
  };

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
    <AuthContext.Provider value={{ user, profile, loading, notifications, logout, openAuthModal, closeAuthModal, markNotificationAsRead }}>
      {children}
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

