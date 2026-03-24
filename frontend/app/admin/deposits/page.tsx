"use client";

import AdminTable from "./table";
import { ShieldAlert, Lock, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      // Test the admin key against a secure endpoint
      const response = await fetch('/api/payment', {
        headers: { 'x-admin-key': adminKey }
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setError("Invalid Admin Secret Key. Access Denied.");
        alert("SECURITY ALERT: Invalid Secret Key Provided.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed.");
      alert("Alert: Server connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
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
                Deposit Requests
              </h1>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">
                Elite Admin Credentials Required
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="password"
                placeholder="Enter Admin Secret Key"
                value={adminKey}
                onChange={(e) => {
                  setAdminKey(e.target.value);
                  setError("");
                }}
                className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-medium`}
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-xs font-bold font-inter tracking-wider bg-red-500/10 py-2 rounded-xl border border-red-500/20 animate-pulse">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative inline-flex items-center justify-center gap-3 py-4 bg-linear-to-r from-[#fbbf24] to-[#f59e0b] text-black font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In To Access <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-center">
             <p className="text-[9px] text-white/10 font-bold uppercase tracking-[0.5em]">
                JSR SPORTS SECURITY SYSTEM v2.0
             </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminTable adminKey={adminKey} />
    </div>
  );
}
