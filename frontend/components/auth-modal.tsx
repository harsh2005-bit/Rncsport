"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, User, Chrome, ArrowRight, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "signIn" | "signUp";

const COLORS = {
  accent: "#fbbf24", // Premium Gold
  accentHover: "#f59e0b",
  accentGlow: "rgba(251, 191, 36, 0.15)",
  bgBase: "#000000",
  bgPanel: "#0d0d0d",
  bgInput: "#141414",
  borderLight: "#262626",
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
  errorBg: "rgba(239, 68, 68, 0.1)",
  errorText: "#f87171"
};

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>("signUp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setMode("signUp");
      setEmail("");
      setPassword("");
      setFullName("");
      setError("");
    }
  }, [isOpen]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signUp") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName) {
          await updateProfile(userCredential.user, { displayName: fullName });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      const error = err as FirebaseError;
      
      if (error.code === 'auth/email-already-in-use') {
        setError("This email is already registered.");
      } else if (error.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (error.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      console.error("Social Auth Error:", err);
      setError(`Failed to sign in with Google.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-0" style={{ zIndex: 99999 }}>
          {/* Deep Dark Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-md"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
               <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px]" 
                style={{ backgroundColor: COLORS.accentGlow }}
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8 sm:p-10 border"
            style={{ 
              backgroundColor: COLORS.bgPanel, 
              borderColor: COLORS.borderLight,
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px ${COLORS.accentGlow}`
            }}
          >
            {/* Close Button line */}
            <button 
              type="button"
              onClick={onClose} 
              className="absolute top-5 right-5 p-2 rounded-full transition-all hover:bg-white/5 active:scale-95 z-50"
              style={{ color: COLORS.textSecondary }}
            >
              <X size={18} />
            </button>

            {/* Autofill overriding CSS block */}
            <style jsx>{`
              input:-webkit-autofill,
              input:-webkit-autofill:hover, 
              input:-webkit-autofill:focus, 
              input:-webkit-autofill:active {
                -webkit-box-shadow: 0 0 0 50px ${COLORS.bgInput} inset !important;
                -webkit-text-fill-color: ${COLORS.textPrimary} !important;
                transition: background-color 5000s ease-in-out 0s;
              }
            `}</style>

            {/* Glowing Top Icon */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center border relative"
                style={{ 
                  backgroundColor: COLORS.bgInput, 
                  color: COLORS.accent, 
                  borderColor: COLORS.borderLight 
                }}
              >
                <div className="absolute inset-0 rounded-2xl blur-md" style={{ backgroundColor: COLORS.accentGlow }}></div>
                <Lock size={28} strokeWidth={2} className="relative z-10" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-black tracking-wide uppercase" style={{ color: COLORS.textPrimary }}>
                {mode === "signUp" ? "Join The Elite" : "Welcome Back"}
              </h2>
              <p className="text-sm font-medium" style={{ color: COLORS.accent }}>
                {mode === "signUp" 
                  ? "Unlock premium access to JSR SPORTS." 
                  : "Sign in to continue your journey."}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex mb-8 relative border-b" style={{ borderColor: COLORS.borderLight }}>
              <button
                type="button"
                onClick={() => setMode("signIn")}
                className="flex-1 pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative focus:outline-none"
                style={{ color: mode === "signIn" ? COLORS.accent : COLORS.textSecondary }}
              >
                Sign In
                {mode === "signIn" && (
                  <motion.div layoutId="auth-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ backgroundColor: COLORS.accent }} />
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode("signUp")}
                className="flex-1 pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative focus:outline-none"
                style={{ color: mode === "signUp" ? COLORS.accent : COLORS.textSecondary }}
              >
                Sign Up
                {mode === "signUp" && (
                  <motion.div layoutId="auth-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ backgroundColor: COLORS.accent }} />
                )}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {mode === "signUp" && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider ml-1" style={{ color: COLORS.textSecondary }}>Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: COLORS.textSecondary }}>
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full rounded-xl py-3.5 pl-11 pr-4 transition-all focus:outline-none border text-sm font-medium"
                      style={{ 
                        backgroundColor: COLORS.bgInput, 
                        borderColor: COLORS.borderLight,
                        color: COLORS.textPrimary,
                        paddingLeft: "44px",
                      }}
                      onFocus={(e) => e.target.style.borderColor = COLORS.accent}
                      onBlur={(e) => e.target.style.borderColor = COLORS.borderLight}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={mode === "signUp"}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider ml-1" style={{ color: COLORS.textSecondary }}>Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: COLORS.textSecondary }}>
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full rounded-xl py-3.5 pl-11 pr-4 transition-all focus:outline-none border text-sm font-medium"
                    style={{ 
                      backgroundColor: COLORS.bgInput, 
                      borderColor: COLORS.borderLight,
                      color: COLORS.textPrimary,
                      paddingLeft: "44px"
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.accent}
                    onBlur={(e) => e.target.style.borderColor = COLORS.borderLight}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider ml-1" style={{ color: COLORS.textSecondary }}>Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: COLORS.textSecondary }}>
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl py-3.5 pl-11 pr-4 transition-all focus:outline-none border text-sm font-medium"
                    style={{ 
                      backgroundColor: COLORS.bgInput, 
                      borderColor: COLORS.borderLight,
                      color: COLORS.textPrimary,
                      paddingLeft: "44px"
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.accent}
                    onBlur={(e) => e.target.style.borderColor = COLORS.borderLight}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div 
                  className="text-[11px] font-bold text-center p-3 rounded-xl border flex items-center justify-center gap-2" 
                  style={{ color: COLORS.errorText, backgroundColor: COLORS.errorBg, borderColor: "rgba(239, 68, 68, 0.2)" }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group mt-4 text-black uppercase tracking-wider text-xs shadow-xl active:scale-[0.98] cursor-pointer"
                style={{ 
                  backgroundColor: COLORS.accent, 
                }}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span className="mt-[2px]">{mode === "signUp" ? "Create Account" : "Secure Sign In"}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: COLORS.borderLight }}></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="px-4" style={{ backgroundColor: COLORS.bgPanel, color: COLORS.textSecondary }}>Or Continue With</span>
              </div>
            </div>

            <div className="grid grid-cols-1">
              <button 
                type="button"
                onClick={() => handleSocialSignIn()}
                disabled={loading}
                className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-bold transition-all active:scale-[0.98] border text-sm cursor-pointer"
                style={{ 
                  backgroundColor: COLORS.bgInput, 
                  borderColor: COLORS.borderLight, 
                  color: COLORS.textPrimary 
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = COLORS.textSecondary}
                onMouseOut={(e) => e.currentTarget.style.borderColor = COLORS.borderLight}
              >
                <Chrome size={18} style={{ color: COLORS.textPrimary }} />
                <span className="mt-[2px]">Google</span>
              </button>
            </div>

            <div className="mt-8 text-center pt-2">
              <p className="text-[10px] leading-relaxed px-2 uppercase tracking-wide font-medium" style={{ color: COLORS.textSecondary }}>
                By continuing, you agree to JSR SPORTS&apos;{" "}
                <button type="button" className="font-bold hover:underline transition-colors focus:outline-none cursor-pointer" style={{ color: COLORS.accent }}>Terms</button> and{" "}
                <button type="button" className="font-bold hover:underline transition-colors focus:outline-none cursor-pointer" style={{ color: COLORS.accent }}>Privacy</button>.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


