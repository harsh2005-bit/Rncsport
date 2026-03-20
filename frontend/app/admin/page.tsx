"use client";

import AdminTable from "./table";
import { ShieldAlert, LogIn, Loader2, XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";

export default function AdminPage() {
  const { user, profile, loading, openAuthModal, logout } = useAuth();

  if (loading || (user && !profile)) {
     return (
        <div className="flex items-center justify-center min-h-[60vh]">
           <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
     );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass border-white/10 p-8 rounded-[2.5rem] bg-black/40 backdrop-blur-xl space-y-8 shadow-2xl text-center"
        >
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldAlert className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter font-cinzel leading-none">
                Restricted Area
              </h1>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">
                Elite Admin Credentials Required
              </p>
            </div>
          </div>

          <button
            onClick={openAuthModal}
            className="w-full group relative inline-flex items-center justify-center gap-3 py-4 bg-linear-to-r from-[#fbbf24] to-[#f59e0b] text-black font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            <LogIn className="w-5 h-5" />
            Sign In To Access
          </button>

          <div className="pt-4 border-t border-white/5 text-center">
             <p className="text-[9px] text-white/10 font-bold uppercase tracking-[0.5em]">
                JSR SPORTS SECURITY SYSTEM v2.0
             </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (profile?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass border-red-500/20 p-8 rounded-[2.5rem] bg-red-950/20 backdrop-blur-xl space-y-8 shadow-2xl text-center"
        >
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter font-cinzel leading-none">
                Access Denied
              </h1>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">
                This account lacks admin privileges
              </p>
            </div>
          </div>
          
          <p className="text-xs text-red-300 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            You are logged in as <strong>{profile?.email}</strong>, but you do not have permission to view the admin dashboard.
          </p>

          <button
            onClick={logout}
            className="w-full group relative inline-flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl hover:bg-white/10 transition-all shadow-xl"
          >
            Switch Account
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminTable />
    </div>
  );
}
