"use client";

import { motion } from "framer-motion";
import { 
  Copy, 
  Check, 
  QrCode, 
  Building2, 
  Wallet,
  ArrowLeft,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const UPI_ID = "harshjhabksc@oksbi";
const BANK_DETAILS = {
  name: "JSR SPORTS PVT LTD",
  account: "987654321012",
  ifsc: "HDFC0001234",
  bank: "HDFC BANK"
};

export default function GetIdPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const router = useRouter();
  const { user, openAuthModal, loading, notifications } = useAuth();

  useEffect(() => {
    if (user && notifications && notifications.length > 0) {
      const hasActiveId = notifications.some(n => 
        (n.title.toLowerCase().includes('approved') || n.status === 'approved') && n.credentials?.id
      );
      if (hasActiveId) {
        router.replace("/payment?mode=upload");
      }
    }
  }, [user, notifications, router]);

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
          <p className="text-white/40 max-w-md mx-auto">Please login to view payment details and get your betting ID.</p>
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

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        {/* Header Section */}
      <section className="text-center space-y-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Arena
        </Link>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-6xl font-black text-white italic tracking-tighter font-cinzel leading-tight md:leading-none"
        >
          GET YOUR <span className="text-gradient-primary uppercase">ELITE BETTING ID</span>
        </motion.h1>
        <p className="text-white/40 text-sm sm:text-lg font-light max-w-2xl mx-auto leading-relaxed px-4">
          Complete the payment below and send proof on WhatsApp to receive your betting ID instantly.
        </p>
      </section>

      {/* Payment Options Grid */}
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
                <h3 className="text-xl font-black text-white italic font-cinzel uppercase tracking-tighter">UPI Payment</h3>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Instant Activation</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border border-white/5 gap-6">
              {/* QR Code */}
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
                    onClick={() => copyToClipboard(UPI_ID, 'upi')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all text-primary"
                  >
                    {copiedField === 'upi' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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
                <h3 className="text-xl font-black text-white italic font-cinzel uppercase tracking-tighter">Bank Transfer</h3>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Secure NEFT / IMPS</p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {[
                { label: "Account Name", value: BANK_DETAILS.name, id: "acc_name" },
                { label: "Account Number", value: BANK_DETAILS.account, id: "acc_num" },
                { label: "IFSC Code", value: BANK_DETAILS.ifsc, id: "ifsc" },
                { label: "Bank Name", value: BANK_DETAILS.bank, id: "bank" }
              ].map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-1">{field.label}</p>
                  <div className="relative group/field">
                    <input 
                      readOnly 
                      value={field.value}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none group-hover/field:border-primary/20 transition-all"
                    />
                    <button 
                      onClick={() => copyToClipboard(field.value, field.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all text-white/20 hover:text-primary"
                    >
                      {copiedField === field.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative glass border-[#fbbf24]/20 p-12 rounded-[4rem] overflow-hidden text-center space-y-10 group"
      >
        <div className="absolute inset-0 bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 glass border-primary/20 text-primary rounded-full mb-4">
            <Zap className="w-4 h-4 fill-current animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Final Protocol Step</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase font-cinzel leading-none">
            Upload <span className="text-gradient-primary">Payment Proof</span>
          </h2>
          <p className="text-white/40 text-base font-light max-w-xl mx-auto leading-relaxed">
            After completing payment, click the button below and upload your payment screenshot. Our team will verify the payment and provide your betting ID.
          </p>
          
          <div className="pt-8">
            <div className="flex justify-center">
              <Link
                href="/payment?mode=upload"
                className="group relative inline-flex items-center justify-center gap-4 w-full sm:w-auto px-20 py-6 bg-linear-to-r from-[#fbbf24] to-[#f59e0b] text-black font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.35)] hover:shadow-[0_0_50px_rgba(251,191,36,0.5)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 skew-x-[-25deg]" />
                <Wallet className="w-5 h-5" />
                Upload Payment Proof
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
    </>
  );
}
