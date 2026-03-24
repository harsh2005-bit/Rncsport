"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  QrCode,
  Building2,
  Wallet,
  Copy,
  Check,
  UploadCloud,
  X,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";


const UPI_ID = "harshjhabksc@oksbi";
const BANK_DETAILS = {
  name: "JSR SPORTS PVT LTD",
  account: "987654321012",
  ifsc: "HDFC0001234",
  bank: "HDFC BANK",
};

type PaymentMethod = "UPI" | "BANK_TRANSFER";

export default function PaymentPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [platform, setPlatform] = useState("All Panel Exch");
  const [transactionId, setTransactionId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [authId, setAuthId] = useState<string>("GUEST");
  const { user, openAuthModal, loading } = useAuth();

  useEffect(() => {
    if (user) {
      setAuthId(user.uid);
      if (user.phoneNumber) setPhoneNumber(user.phoneNumber);
      if (user.displayName) setName(user.displayName);
    } else {
      setAuthId("GUEST");
    }
  }, [user]);

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
          <p className="text-white/40 max-w-md mx-auto">Please login to submit payment proof and activate your betting ID.</p>
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

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

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
    
    // Create preview
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

    if (!name.trim() || !phoneNumber.trim()) {
      setMessage("Name and mobile number are required.");
      return;
    }
    if (!file) {
      setMessage("Please upload a payment screenshot.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", authId);
      formData.append("name", name.trim());
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("paymentMethod", paymentMethod);
      formData.append("platform", platform);
      formData.append("transactionId", transactionId.trim() || "");

      // 2. Fetch Firebase ID Token for secure backend verification
      const token = await user.getIdToken();

      // 3. Send to Next.js API Route (internal)
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to store in database");
      }

      setMessage("Payment proof submitted successfully. Our team will verify shortly.");
      setTransactionId("");
      setFile(null);
      setPreviewUrl(null);
    } catch (err: unknown) {
      console.error("Submission Error:", err);
      const error = err as Error;
      setMessage(error.message || "Something went wrong. Please try again.");
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
          className="text-2xl sm:text-4xl md:text-5xl font-black text-white italic tracking-tighter font-cinzel uppercase leading-tight"
        >
          Activate Your <span className="text-gradient-primary">Betting ID</span>
        </motion.h1>
        <p className="text-white/40 text-xs sm:text-lg font-light max-w-2xl mx-auto leading-relaxed px-2 md:px-4">
          Complete your deposit and upload proof for instant account activation.
        </p>
      </section>


      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* UPI Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group lg:card-hover"
        >
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative glass border-[#fbbf24]/20 p-6 sm:p-8 rounded-4xl sm:rounded-[3rem] space-y-8 flex flex-col h-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic font-cinzel uppercase tracking-tighter">
                  UPI Payment
                </h3>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                  Instant Activation
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border border-white/5 gap-6">
              <div className="w-56 h-56 md:w-48 md:h-48 bg-white rounded-2xl flex items-center justify-center relative overflow-hidden group/qr shadow-2xl">
                <Image
                  src="/upi_qr.jpg"
                  alt="UPI QR Code"
                  width={200}
                  height={200}
                  className="object-contain group-hover/qr:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="w-full space-y-4">
                <div className="relative group/field">
                  <div className="absolute inset-y-0 left-4 flex items-center text-white/20">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <input
                    readOnly
                    value={UPI_ID}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-xs font-black text-white outline-none focus:border-primary/40 transition-all font-mono"
                  />
                  <button
                    onClick={() => handleCopy(UPI_ID, "upi")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all text-primary"
                  >
                    {copied === "upi" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-center text-[10px] font-black text-white/30 uppercase tracking-widest">
                  Scan the QR code or send payment to the UPI ID above.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bank Transfer Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group lg:card-hover"
        >
          <div className="absolute inset-0 bg-secondary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative glass border-[#fbbf24]/20 p-6 sm:p-8 rounded-4xl sm:rounded-[3rem] space-y-8 flex flex-col h-full text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic font-cinzel uppercase tracking-tighter">
                  Bank Transfer
                </h3>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                  Secure NEFT / IMPS
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {[
                { label: "Account Name", value: BANK_DETAILS.name, id: "acc_name" },
                { label: "Account Number", value: BANK_DETAILS.account, id: "acc_num" },
                { label: "IFSC Code", value: BANK_DETAILS.ifsc, id: "ifsc" },
                { label: "Bank Name", value: BANK_DETAILS.bank, id: "bank" },
              ].map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-1">
                    {field.label}
                  </p>
                  <div className="relative group/field">
                    <input
                      readOnly
                      value={field.value}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none group-hover/field:border-primary/20 transition-all"
                    />
                    <button
                      onClick={() => handleCopy(field.value, field.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all text-white/20 hover:text-primary"
                    >
                      {copied === field.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upload Payment Proof */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative glass border-[#fbbf24]/20 p-8 md:p-12 rounded-3xl sm:rounded-[4rem] overflow-hidden space-y-8"
      >
        <div className="absolute inset-0 bg-primary/3 opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 glass border-primary/20 text-primary rounded-full mb-4">
            <UploadCloud className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Upload Payment Proof
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold"
                  placeholder="Enter your full name"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold"
                >
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Platform Selection
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all font-bold"
                >
                  <option value="All Panel Exch">All Panel Exch</option>
                  <option value="Go Exch 777">Go Exch 777</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Transaction ID/UTR
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary/40 transition-all"
                  placeholder="Enter transaction reference"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                Upload Screenshot
              </label>
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-6 transition-all duration-300 min-h-[250px]",
                  dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-white/10 bg-black/30",
                  previewUrl ? "border-primary/50" : ""
                )}
              >
                {!previewUrl ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                      <UploadCloud className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-bold text-white">
                        Drag & drop your screenshot here
                      </p>
                      <p className="text-[11px] text-white/40 uppercase tracking-widest">
                        JPG or PNG, max size 5MB
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-px w-8 bg-white/10" />
                      <span className="text-[10px] font-black text-white/20">OR</span>
                      <div className="h-px w-8 bg-white/10" />
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshot"
                    />
                    <label
                      htmlFor="screenshot"
                      className="cursor-pointer inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-black hover:border-primary transition-all shadow-xl"
                    >
                      Choose from files
                    </label>
                  </>
                ) : (
                  <div className="relative group w-full max-w-sm">
                    <div className="absolute -top-4 -right-4 z-20">
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                        }}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <Image
                        src={previewUrl}
                        alt="Payment screenshot preview"
                        fill
                        className="object-contain bg-black/50"
                      />
                    </div>
                    <p className="mt-4 text-[10px] font-black text-primary uppercase tracking-[0.2em] text-center">
                      ✓ {file?.name} Selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-4 rounded-xl text-center text-sm font-black uppercase tracking-widest border",
                  message.includes("success") || message.includes("submitted")
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                )}
              >
                {message}
              </motion.div>
            )}

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={submitting}
                className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 bg-linear-to-r from-[#fbbf24] to-[#f59e0b] text-black font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(251,191,36,0.35)] disabled:opacity-60 disabled:hover:scale-100"
              >
                {submitting ? "Submitting..." : "Submit Payment Proof"}
              </button>
            </div>
          </form>
        </div>
      </motion.section>
    </div>
  );
}
