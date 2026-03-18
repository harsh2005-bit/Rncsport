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

// Hex color constants for safety against theme overrides
const COLORS = {
  emerald500: "#10b981",
  emerald600: "#059669",
  emerald50: "#ecfdf5",
  slate900: "#0f172a",
  slate800: "#1e293b",
  slate700: "#334155",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50: "#f8fafc",
  white: "#ffffff",
  black: "#000000"
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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-xl"
            style={{ backgroundColor: "rgba(241, 245, 249, 0.4)" }}
          >
            {/* Decorative background text */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <span className="absolute top-[20%] left-[10%] text-9xl font-black rotate-[-5deg] select-none" style={{ color: COLORS.slate800 }}>service</span>
              <span className="absolute bottom-[20%] right-[10%] text-9xl font-black rotate-[-5deg] select-none" style={{ color: COLORS.slate800 }}>space</span>
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px]" 
                style={{ backgroundColor: "rgba(167, 243, 208, 0.5)" }}
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-10 border"
            style={{ backgroundColor: COLORS.white, borderColor: COLORS.slate200 }}
          >
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-2 transition-colors"
              style={{ color: COLORS.slate400 }}
            >
              <X size={20} />
            </button>

            {/* Top Icon */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center border"
                style={{ backgroundColor: COLORS.emerald50, color: COLORS.emerald500, borderColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <Lock size={24} strokeWidth={2.5} />
              </div>
            </div>

            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: COLORS.slate900 }}>
                {mode === "signUp" ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm" style={{ color: COLORS.slate500 }}>
                {mode === "signUp" 
                  ? "Start your secure journey with JSR SPORTS today." 
                  : "Continue your elite experience with JSR SPORTS."}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex mb-8 relative border-b" style={{ borderColor: COLORS.slate100 }}>
              <button
                onClick={() => setMode("signIn")}
                className="flex-1 pb-4 text-sm font-semibold transition-colors relative"
                style={{ color: mode === "signIn" ? COLORS.emerald500 : COLORS.slate400 }}
              >
                Sign In
                {mode === "signIn" && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: COLORS.emerald500 }} />
                )}
              </button>
              <button
                onClick={() => setMode("signUp")}
                className="flex-1 pb-4 text-sm font-semibold transition-colors relative"
                style={{ color: mode === "signUp" ? COLORS.emerald500 : COLORS.slate400 }}
              >
                Sign Up
                {mode === "signUp" && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: COLORS.emerald500 }} />
                )}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-5">
              {mode === "signUp" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold ml-1" style={{ color: COLORS.slate700 }}>Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: COLORS.slate400 }}>
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Erik Wilson"
                      className="w-full rounded-2xl py-3.5 pl-12 pr-4 transition-all focus:outline-none focus:ring-2 border"
                      style={{ 
                        backgroundColor: COLORS.slate50, 
                        borderColor: COLORS.slate200,
                        color: COLORS.slate900,
                        boxShadow: "0 0 0 2px rgba(16, 185, 129, 0)"
                      }}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={mode === "signUp"}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold ml-1" style={{ color: COLORS.slate700 }}>Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: COLORS.slate400 }}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="tanjakauderer@gmail.com"
                    className="w-full rounded-2xl py-3.5 pl-12 pr-4 transition-all focus:outline-none focus:ring-2 border"
                    style={{ 
                      backgroundColor: COLORS.slate50, 
                      borderColor: COLORS.slate200,
                      color: COLORS.slate900,
                      boxShadow: "0 0 0 2px rgba(16, 185, 129, 0)"
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold ml-1" style={{ color: COLORS.slate700 }}>Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: COLORS.slate400 }}>
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl py-3.5 pl-12 pr-4 transition-all focus:outline-none focus:ring-2 border"
                    style={{ 
                      backgroundColor: COLORS.slate50, 
                      borderColor: COLORS.emerald500,
                      color: COLORS.slate900,
                      boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.1)"
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-[10px] font-bold text-center py-2 rounded-lg border" style={{ color: "#f43f5e", backgroundColor: "#fff1f2", borderColor: "#ffe4e6" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group mt-2"
                style={{ 
                  backgroundColor: COLORS.emerald600, 
                  color: COLORS.white,
                  boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.2)"
                }}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {mode === "signUp" ? "Create Account" : "Sign In"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: COLORS.slate100 }}></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-4 font-bold tracking-wider" style={{ backgroundColor: COLORS.white, color: COLORS.slate400 }}>OR CONTINUE WITH</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => handleSocialSignIn()}
                disabled={loading}
                className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl font-semibold transition-all active:scale-95 border"
                style={{ backgroundColor: COLORS.white, borderColor: COLORS.slate200, color: COLORS.slate700 }}
              >
                <Chrome size={18} />
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="mt-10 text-center">
              <p className="text-xs leading-relaxed px-6" style={{ color: COLORS.slate400 }}>
                By continuing, you agree to JSR SPORTS&apos;s{" "}
                <a href="#" className="font-bold hover:underline" style={{ color: COLORS.emerald500 }}>Terms of Service</a> and{" "}
                <a href="#" className="font-bold hover:underline" style={{ color: COLORS.emerald500 }}>Privacy Policy</a>.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


