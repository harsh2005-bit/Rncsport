"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  QrCode,
  Building2,
  Lock,
  X,
  KeyRound,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type PaymentMethod = "UPI" | "BANK_TRANSFER";

export default function WithdrawalPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");

  // Bank
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holderName, setHolderName] = useState("");

  // UPI
  const [upiId, setUpiId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Credentials
  const [bettingId, setBettingId] = useState("");
  const [bettingPassword, setBettingPassword] = useState("");

  const { user, profile, openAuthModal, loading } = useAuth();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (user) {
      if (user.phoneNumber) setPhoneNumber(user.phoneNumber);
      if (user.displayName || profile?.username) setName(user.displayName || profile?.username || "");
    }
  }, [user, profile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase font-cinzel">Access Restricted</h2>
          <p className="text-white/40 max-w-md mx-auto">Please login to request a withdrawal from your account.</p>
        </div>
        <button 
          onClick={openAuthModal}
          className="px-12 py-5 bg-primary text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  const validateAndSetFile = (f: File) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(f.type)) {
      setMessage("Only JPG and PNG images are allowed.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setMessage("Maximum file size is 5MB.");
      return;
    }

    setMessage(null);
    setFile(f);
    
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) validateAndSetFile(f);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 100) {
      setMessage("Minimum withdrawal amount is ₹100.");
      return;
    }

    if (!name.trim() || !phoneNumber.trim()) {
      setMessage("Name and phone number are required.");
      return;
    }

    if (!bettingId.trim() || !bettingPassword.trim()) {
      setMessage("Betting ID and Password are required.");
      return;
    }

    if (paymentMethod === "BANK_TRANSFER") {
      if (!accountNumber.trim() || !ifsc.trim() || !holderName.trim()) {
        setMessage("Complete bank details are required.");
        return;
      }
    } else {
      if (!upiId.trim() && !file) {
        setMessage("UPI ID or QR screenshot is required.");
        return;
      }
    }

    setSubmitting(true);
    try {
      // Check for existing pending requests
      const pendingQuery = query(
        collection(db, "withdrawals"), 
        where("userId", "==", user.uid),
        where("status", "==", "pending")
      );
      const pendingSnap = await getDocs(pendingQuery);
      if (!pendingSnap.empty) {
        setMessage("You already have a pending withdrawal request.");
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("userId", user.uid);
      formData.append("name", name.trim());
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("amount", amount);
      formData.append("paymentMethod", paymentMethod);
      
      if (paymentMethod === "BANK_TRANSFER") {
        formData.append("accountNumber", accountNumber.trim());
        formData.append("ifsc", ifsc.trim().toUpperCase());
        formData.append("holderName", holderName.trim());
      } else {
        formData.append("upiId", upiId.trim());
        if (file) {
          formData.append("file", file);
        }
      }
      
      formData.append("bettingId", bettingId.trim());
      formData.append("bettingPassword", bettingPassword.trim());

      const res = await fetch("/api/withdrawal", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit withdrawal request.");
      }

      setMessage("Request submitted successfully");
      setAmount("");
      setBettingId("");
      setBettingPassword("");
      setAccountNumber("");
      setIfsc("");
      setHolderName("");
      setUpiId("");
      setFile(null);
      setPreviewUrl(null);

    } catch (err: unknown) {
      console.error("Withdrawal Submission Error:", err);
      const error = err as Error;
      setMessage(error?.message || "Something went wrong, try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 mt-20 sm:mt-32 px-4 md:px-8 overflow-hidden">
      {/* Header */}
      <section className="text-center space-y-3 md:space-y-4 pt-10 md:pt-0">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-4xl md:text-5xl font-black text-white italic tracking-tighter font-cinzel uppercase"
        >
          Withdraw Funds
        </motion.h1>
        <p className="text-white/40 text-xs sm:text-lg font-light max-w-2xl mx-auto leading-relaxed px-2 md:px-4">
          Submit your withdrawal request securely. Standard processing time is under 15 minutes.
        </p>
      </section>

      {/* Form Container */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative glass border-[#fbbf24]/20 p-5 md:p-12 rounded-2xl md:rounded-[4rem] overflow-hidden space-y-6 md:space-y-8 max-w-3xl mx-auto"
      >

        <div className="absolute inset-0 bg-primary/3 opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative z-10 space-y-8">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                Withdrawal Amount (₹)
              </label>
              <div className="relative group/field">
                <input
                  type="number"
                  required
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black/40 border border-primary/20 rounded-xl py-4 px-5 text-xl text-primary font-black outline-none focus:border-primary/60 transition-all text-center placeholder:text-primary/20"
                  placeholder="Min ₹100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Mobile Number
                </label>
                <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/40 transition-all group">
                  <div className="bg-white/5 px-4 py-3 border-r border-white/10 text-primary font-black text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="flex-1 bg-transparent py-3 px-4 text-sm text-white outline-none font-bold"
                    placeholder="70000 00000"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div className="space-y-2">
               <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Betting ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-white/20">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={bettingId}
                    onChange={(e) => setBettingId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold"
                    placeholder="Enter ID"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Password
                </label>
                 <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-white/20">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={bettingPassword}
                    onChange={(e) => setBettingPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold"
                    placeholder="Enter Password"
                  />
                 </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Receive Payment Via
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={cn(
                      "flex items-center justify-center gap-2 py-4 rounded-xl border font-black text-xs uppercase tracking-widest transition-all",
                      paymentMethod === "UPI" ? "bg-primary/20 border-primary text-primary" : "bg-black/40 border-white/10 text-white/40 hover:bg-white/5"
                    )}
                  >
                    <QrCode className="w-4 h-4" />
                    UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("BANK_TRANSFER")}
                    className={cn(
                      "flex items-center justify-center gap-2 py-4 rounded-xl border font-black text-xs uppercase tracking-widest transition-all",
                      paymentMethod === "BANK_TRANSFER" ? "bg-primary/20 border-primary text-primary" : "bg-black/40 border-white/10 text-white/40 hover:bg-white/5"
                    )}
                  >
                    <Building2 className="w-4 h-4" />
                    Bank Transfer
                  </button>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {paymentMethod === "UPI" ? (
                  <motion.div
                    key="upi"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                         UPI ID (Optional if QR uploaded)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold"
                        placeholder="yourname@upi"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                        Or Upload My UPI QR
                      </label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={cn(
                          "relative border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300",
                          dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-white/10 bg-black/30",
                          previewUrl ? "border-primary/50" : ""
                        )}
                      >
                        {!previewUrl ? (
                          <>
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                              onChange={handleFileChange}
                              className="hidden"
                              id="qrScreenshot"
                            />
                            <label
                              htmlFor="qrScreenshot"
                              className="cursor-pointer inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-black hover:border-primary transition-all shadow-lg"
                            >
                              Choose QR Image
                            </label>
                          </>
                        ) : (
                          <div className="relative group w-full max-w-xs flex justify-center">
                            <div className="absolute top-0 right-0 z-20">
                              <button
                                type="button"
                                onClick={() => {
                                  setFile(null);
                                  setPreviewUrl(null);
                                }}
                                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="relative aspect-square w-32 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                              <Image
                                src={previewUrl}
                                alt="QR code preview"
                                fill
                                className="object-contain bg-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="bank"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                          Account Number
                       </label>
                       <input
                         type="text"
                         required={paymentMethod === "BANK_TRANSFER"}
                         value={accountNumber}
                         onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                         className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold tracking-widest"
                         placeholder="XXXX XXXX XXXX"
                       />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                            IFSC Code
                         </label>
                         <input
                           type="text"
                           required={paymentMethod === "BANK_TRANSFER"}
                           value={ifsc}
                           onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                           className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold uppercase"
                           placeholder="e.g. SBIN0001234"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                            Account Holder Name
                         </label>
                         <input
                           type="text"
                           required={paymentMethod === "BANK_TRANSFER"}
                           value={holderName}
                           onChange={(e) => setHolderName(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold"
                           placeholder="Full Name as in Bank"
                         />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-4 rounded-xl text-center text-sm font-black uppercase tracking-widest border",
                  message.includes("success") || message.includes("wait")
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                )}
              >
                {message}
              </motion.div>
            )}

            <div className="pt-6 flex justify-center">
              <button
                type="submit"
                disabled={submitting}
                className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 bg-linear-to-r from-[#fbbf24] to-[#f59e0b] text-black font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(251,191,36,0.35)] disabled:opacity-60 disabled:hover:scale-100"
              >
                {submitting ? "Processing..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </motion.section>
    </div>
  );
}
