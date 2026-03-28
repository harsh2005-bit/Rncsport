"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  QrCode,
  Building2,
  Lock,
  X,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function WithdrawalPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

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

  const { user, profile, notifications, openAuthModal, loading } = useAuth();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (user) {
      const rawPhone = user.phoneNumber || "";
      const displayPhone = rawPhone.replace("+91", "").trim();
      setPhoneNumber(displayPhone);
      if (user.displayName || profile?.username) setName(user.displayName || profile?.username || "");
    }
  }, [user, profile]);

  // Auto-fill Betting ID from latest approved notification
  useEffect(() => {
    if (notifications.length > 0) {
      const approvedNotif = notifications.find(n => 
        (n.title.toLowerCase().includes("approved") || n.status === "approved") && 
        n.credentials?.id
      );
      if (approvedNotif && approvedNotif.credentials) {
        if (!bettingId) setBettingId(approvedNotif.credentials.id);
      }
    }
  }, [notifications, bettingId]);

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

    if (!bettingId.trim()) {
      setMessage("Betting ID is required.");
      return;
    }

    if (!accountNumber.trim() || !ifsc.trim() || !holderName.trim()) {
      setMessage("Bank Details (A/C, IFSC, Holder) are required.");
      return;
    }

    if (!upiId.trim() && !file) {
      setMessage("UPI ID or QR screenshot is required.");
      return;
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
      
      // Mandatory Bank Details
      formData.append("accountNumber", accountNumber.trim());
      formData.append("ifsc", ifsc.trim().toUpperCase());
      formData.append("holderName", holderName.trim());
      
      // Mandatory UPI Details
      formData.append("upiId", upiId.trim());
      if (file) {
        formData.append("file", file);
      }
      
      formData.append("bettingId", bettingId.trim());

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
                  Withdrawal Agent
                </label>
                <input
                  type="text"
                  readOnly
                  value={name}
                  className="w-full bg-black/60 border border-white/5 rounded-xl py-3 px-4 text-sm text-white/50 outline-none cursor-not-allowed font-bold"
                  placeholder="Login to see name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Registered Mobile
                </label>
                <div className="flex items-center bg-black/60 border border-white/5 rounded-xl overflow-hidden cursor-not-allowed opacity-50">
                  <div className="bg-white/5 px-4 py-3 border-r border-white/10 text-primary font-black text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    readOnly
                    value={phoneNumber}
                    className="flex-1 bg-transparent py-3 px-4 text-sm text-white outline-none font-bold"
                    placeholder="70000 00000"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="space-y-2">
               <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Authorized Betting ID {bettingId && "(Sticky)"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-white/20">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    readOnly={!!bettingId}
                    value={bettingId}
                    onChange={(e) => setBettingId(e.target.value)}
                    className={cn(
                      "w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold",
                      bettingId && "bg-black/60 text-white/50 cursor-not-allowed"
                    )}
                    placeholder={bettingId ? "Loading mapping..." : "Pending Admin Allocation"}
                  />
                </div>
              </div>
            </div>

            {/* Settlement Details Section - Showing Both Mandatory */}
            <div className="pt-6 border-t border-white/5 space-y-10">
              
              {/* Bank Transfer Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white italic tracking-tighter uppercase font-cinzel">Bank Account Details</h3>
                    <p className="text-[8px] text-white/40 font-black uppercase tracking-widest">Compulsory for Settlement</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Account Number</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold tracking-widest"
                      placeholder="XXXX XXXX XXXX"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">IFSC Code</label>
                      <input
                        type="text"
                        required
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold uppercase"
                        placeholder="e.g. SBIN0001234"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">A/C Holder Name</label>
                      <input
                        type="text"
                        required
                        value={holderName}
                        onChange={(e) => setHolderName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold"
                        placeholder="As per Bank Passbook"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* UPI Section */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white italic tracking-tighter uppercase font-cinzel">UPI Settlement</h3>
                    <p className="text-[8px] text-white/40 font-black uppercase tracking-widest">Compulsory for Faster Payouts</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold"
                      placeholder="yourname@upi"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Upload UPI QR</label>
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={cn(
                        "relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300",
                        dragActive ? "border-primary bg-primary/5" : "border-white/10 bg-black/30",
                        previewUrl ? "border-primary/50" : ""
                      )}
                    >
                      {!previewUrl ? (
                        <>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                            id="qrScreenshot"
                          />
                          <label
                            htmlFor="qrScreenshot"
                            className="cursor-pointer inline-flex items-center justify-center px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-black hover:border-primary transition-all shadow-lg"
                          >
                            Select QR Photo
                          </label>
                        </>
                      ) : (
                        <div className="relative group w-full max-w-xs flex justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                              setPreviewUrl(null);
                            }}
                            className="absolute -top-3 -right-3 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-xl"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="relative aspect-square w-40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <Image
                              src={previewUrl}
                              alt="QR Preview"
                              fill
                              className="object-contain bg-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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

function formatTime(date: Date | string | number | { seconds: number } | null) {
  if (!date) return "N/A";
  let d: Date;
  if (typeof date === 'object' && 'seconds' in date) {
    d = new Date(date.seconds * 1000);
  } else {
    d = new Date(date as string | number | Date);
  }
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(date: Date | string | number | { seconds: number } | null) {
  if (!date) return "N/A";
  let d: Date;
  if (typeof date === 'object' && 'seconds' in date) {
    d = new Date(date.seconds * 1000);
  } else {
    d = new Date(date as string | number | Date);
  }
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function statusBadge(status: string) {
  const s = status?.toLowerCase();
  if (s === "approved") {
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
         <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 font-inter">Authorized</span>
      </div>
    );
  }
  if (s === "rejected") {
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 w-fit">
         <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 font-inter">Declined</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
       <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 font-inter">Pending</span>
    </div>
  );
}
