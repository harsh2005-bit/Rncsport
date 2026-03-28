"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, User, Phone, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { 
  RecaptchaVerifier,
  signInWithPhoneNumber, 
  updateProfile,
  ConfirmationResult
} from "firebase/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = "details" | "otp";

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
  const [step, setStep] = useState<AuthStep>("details");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStep("details");
      setFullName("");
      setPhone("");
      setOtp("");
      setError("");
      setConfirmationResult(null);
    }
  }, [isOpen]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    
    if (!fullName.trim()) return setError("Please enter your name");
    if (phone.length !== 10) return setError("Enter a valid 10-digit mobile number");

    setLoading(true);
    try {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      await verifier.render();
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, verifier);
      setConfirmationResult(result);
      setStep("otp");
    } catch (err: unknown) {
      console.error("OTP Send Error:", err);
      const message = err instanceof Error ? err.message : "Failed to send OTP. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    
    if (otp.length !== 6) return setError("Enter the 6-digit OTP");
    if (!confirmationResult) return setError("Session expired. Please try again.");

    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(otp);
      if (fullName.trim()) {
        await updateProfile(userCredential.user, { displayName: fullName.trim() });
      }
      onClose();
    } catch (err: unknown) {
      console.error("OTP Verify Error:", err);
      setError("Invalid OTP or session expired. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
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
            key={step}
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
                {step === "details" ? (
                  <Lock size={28} strokeWidth={2} className="relative z-10" />
                ) : (
                  <CheckCircle2 size={28} strokeWidth={2} className="relative z-10" />
                )}
              </div>
            </div>

            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-black tracking-wide uppercase" style={{ color: COLORS.textPrimary }}>
                {step === "details" ? "Join The Elite" : "Verify ID"}
              </h2>
              <p className="text-sm font-medium" style={{ color: COLORS.accent }}>
                {step === "details" 
                  ? "Unlock premium access to JSR SPORTS." 
                  : `Enter the code sent to +91 ${phone}`}
              </p>
            </div>

            {step === "details" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider ml-1" style={{ color: COLORS.textSecondary }}>Mobile Number</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors flex items-center gap-1 font-bold text-xs" style={{ color: COLORS.textSecondary }}>
                      <Phone size={14} />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      maxLength={10}
                      className="w-full rounded-xl py-3.5 pr-4 transition-all focus:outline-none border text-sm font-medium"
                      style={{ 
                        backgroundColor: COLORS.bgInput, 
                        borderColor: COLORS.borderLight,
                        color: COLORS.textPrimary,
                        paddingLeft: "72px"
                      }}
                      onFocus={(e) => e.target.style.borderColor = COLORS.accent}
                      onBlur={(e) => e.target.style.borderColor = COLORS.borderLight}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
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
                      <span className="mt-[2px]">Send OTP</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider ml-1" style={{ color: COLORS.textSecondary }}>6-Digit OTP</label>
                  <div className="relative group text-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="••••••"
                      maxLength={6}
                      className="w-full rounded-xl py-4 text-center tracking-[1em] transition-all focus:outline-none border text-lg font-black"
                      style={{ 
                        backgroundColor: COLORS.bgInput, 
                        borderColor: COLORS.borderLight,
                        color: COLORS.accent,
                      }}
                      onFocus={(e) => e.target.style.borderColor = COLORS.accent}
                      onBlur={(e) => e.target.style.borderColor = COLORS.borderLight}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                      autoFocus
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
                      <span className="mt-[2px]">Verify & Join</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="w-full text-[10px] font-bold uppercase tracking-widest pt-2 hover:opacity-80 transition-opacity"
                  style={{ color: COLORS.textSecondary }}
                >
                  ← Edit Phone Number
                </button>
              </form>
            )}

            <div className="mt-8 text-center pt-2">
              <p className="text-[10px] leading-relaxed px-2 uppercase tracking-wide font-medium" style={{ color: COLORS.textSecondary }}>
                By continuing, you agree to JSR SPORTS&apos;{" "}
                <button type="button" className="font-bold hover:underline transition-colors focus:outline-none cursor-pointer" style={{ color: COLORS.accent }}>Terms</button> and{" "}
                <button type="button" className="font-bold hover:underline transition-colors focus:outline-none cursor-pointer" style={{ color: COLORS.accent }}>Privacy</button>.
              </p>
            </div>
            <div id="recaptcha-container"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


