"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MessageCircle, X, Clock, Loader2, ArrowLeft, XCircle, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PaymentRequest {
  id: string;
  name: string;
  phoneNumber: string;
  paymentMethod: string;
  platform?: string;
  transactionId?: string;
  screenshotUrl: string;
  status: string;
  createdAt: Date | string | number | null;
}


export default function AdminTable({ adminKey }: { adminKey: string }) {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [isPending, startTransition] = useTransition();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // Switching to STABLE API FETCHING (Guaranteed to work bypasses client-side rules)
  useEffect(() => {
    const fetchData = async (isInitial = false) => {
      try {
        const response = await fetch('/api/payment', {
          headers: { 
            'x-admin-key': adminKey 
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPayments(data);
        }
      } catch (error) {
        console.error("API Fetch Error:", error);
      } finally {
        if (isInitial) setLoading(false);
      }
    };

    fetchData(true);
    // Polling every 5 seconds for stability and "real-time" feel
    const interval = setInterval(() => fetchData(false), 5000);
    return () => clearInterval(interval);
  }, [adminKey]);



  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [credId, setCredId] = useState("");
  const [credPass, setCredPass] = useState("");
  const [credLink, setCredLink] = useState("");

  const updateStatus = async (id: string, status: string, creds?: any) => {
    if (status === "approved" && !creds) {
      setApprovingId(id);
      return;
    }

    startTransition(async () => {
      try {
        const payload = { 
          id, 
          status,
          ...(creds || {})
        };

        const response = await fetch('/api/payment', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-key': adminKey
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          setPayments(prev => prev.map(p => p.id === id ? { ...p, status: status } : p));
          setApprovingId(null);
          setCredId("");
          setCredPass("");
          setCredLink("");
        } else {
          const res = await response.json();
          alert(`Error: ${res.message || 'Update failed'}`);
        }
      } catch (error) {
        console.error("Status Update Error:", error);
        alert("Server connection error.");
      }
    });
  };


  const filteredItems = payments.filter(item => {
    const s = item.status?.toUpperCase();
    if (filter === 'ALL') return true;
    if (filter === 'PENDING' && (s === 'PENDING' || s === 'pending')) return true;
    return s === filter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <p className="text-white/60 font-black uppercase tracking-widest animate-pulse">Syncing Secure Data Channel...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1080px] mx-auto px-2 md:px-4 space-y-6 pb-20">
      
      {/* Consistently stylized Back and Filter row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <button 
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="flex justify-end gap-3 px-2">
           {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={cn(
                 "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                 filter === f 
                  ? "bg-primary text-black border-primary shadow-lg shadow-primary/20" 
                  : "bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10"
               )}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      <div className="mb-2">
         <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-white uppercase font-cinzel">
           Verification <span className="text-yellow-400">Center</span>
         </h1>
         <p className="text-white/40 text-[9px] font-black tracking-[0.3em] uppercase mt-0.5">Authorized Transaction Stream</p>
      </div>

      <div className="bg-black/40 border border-yellow-400/20 rounded-3xl p-6 md:p-8 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10" />

        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-white/5">
          {filteredItems.length === 0 ? (
            <div className="text-center py-40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4">
               <Clock className="w-12 h-12 text-white/10" />
               <h2 className="text-xl font-black text-white/20 uppercase tracking-[0.5em]">System Idle</h2>
               <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest">Awaiting neural data influx</p>
            </div>
          ) : (
            <table className="table-auto w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[9px] text-white/40 uppercase tracking-[0.3em] font-black font-inter">
                  <th className="px-4 py-2 whitespace-nowrap">Member Name</th>
                  <th className="px-4 py-2 whitespace-nowrap">Contact</th>
                  <th className="px-4 py-2 whitespace-nowrap">Channel</th>
                  <th className="px-4 py-2 whitespace-nowrap">Transaction ID</th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">Proof</th>
                  <th className="px-4 py-2 whitespace-nowrap">Status</th>
                  <th className="px-4 py-2 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white/3 hover:bg-white/5 border border-white/5 transition-all group"
                  >
                    <td className="px-4 py-4 rounded-l-2xl">
                      <span className="font-bold text-white uppercase tracking-tighter text-sm italic group-hover:text-primary transition-colors">{item.name}</span>
                    </td>
                    <td className="px-4 py-4 font-mono text-white/50 text-[11px] tracking-wider">
                      {item.phoneNumber}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-primary text-[9px] font-black uppercase border border-primary/20">
                        {item.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-4 max-w-[140px]">
                      <span className="text-[11px] text-white/70 font-mono font-bold break-all leading-tight">
                        {item.transactionId || "NO ID"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <img 
                          alt="Proof"
                          onClick={() => setSelectedImage(item.screenshotUrl)}
                          src={item.screenshotUrl} 
                          className="w-16 h-16 object-cover rounded cursor-pointer border border-white/10 hover:border-primary/60 shadow-xl transition-all"
                          onError={(e) => {
                             (e.target as HTMLImageElement).src = '/logo.jpg';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {statusBadge(item.status)}
                    </td>
                    <td className="px-4 py-4 text-right rounded-r-2xl">
                       <div className="flex items-center justify-end gap-2">
                         <a
                           href={`https://wa.me/${item.phoneNumber?.replace(/[^0-9]/g, '')}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="p-2.5 rounded-xl bg-white/5 text-white/30 hover:text-emerald-400 transition-all border border-white/10"
                         >
                           <MessageCircle className="w-4 h-4" />
                         </a>

                         {(item.status?.toLowerCase() === "pending") && (
                           <div className="flex gap-1.5">
                             <button
                               onClick={() => updateStatus(item.id, "approved")}
                               disabled={isPending}
                               className="bg-primary hover:bg-secondary text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95 shadow-md"
                             >
                               Verify
                             </button>
                             <button
                               onClick={() => updateStatus(item.id, "rejected")}
                               disabled={isPending}
                               className="bg-white/5 hover:bg-red-500 text-white/30 hover:text-white p-2 rounded-xl transition-all border border-white/10 active:scale-95 cursor-pointer"
                             >
                               <XCircle className="w-4 h-4" />
                             </button>
                           </div>
                         )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {approvingId && (
          <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApprovingId(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass border border-white/10 rounded-[2.5rem] bg-[#0b0b0b] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-white italic font-cinzel uppercase tracking-tighter">Approval Intelligence</h3>
                   <p className="text-[9px] text-primary/60 font-black uppercase tracking-widest">Assign Member Access</p>
                </div>
                <button 
                  onClick={() => setApprovingId(null)}
                  className="p-3 bg-white/5 rounded-full text-white/20 hover:text-white transition-all border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Betting ID</label>
                  <input 
                    value={credId}
                    onChange={(e) => setCredId(e.target.value)}
                    placeholder="e.g. USER123"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-primary/40 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Password</label>
                  <input 
                    value={credPass}
                    onChange={(e) => setCredPass(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-primary/40 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Panel Link (URL)</label>
                  <input 
                    value={credLink}
                    onChange={(e) => setCredLink(e.target.value)}
                    placeholder="https://panel.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-primary/40 outline-none transition-all font-bold"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => updateStatus(approvingId, "approved", { bettingId: credId, bettingPassword: credPass, panelLink: credLink })}
                    disabled={!credId || !credPass || !credLink}
                    className="w-full py-4 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-30 disabled:hover:scale-100"
                  >
                    Authorize & Notify Member
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {selectedImage && (

          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black/98 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-5xl max-h-[95vh] glass border-white/10 rounded-[2.5rem] bg-background shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter italic font-cinzel">Proof Intelligence</h3>
                    <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest">Secure Asset Preview</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="p-4 bg-white/5 rounded-full text-white/20 hover:text-white transition-all border border-white/10 active:scale-90"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 md:p-12 flex items-center justify-center bg-black/60 custom-scrollbar">
                <Image 
                  src={selectedImage} 
                  alt="Full Proof Asset" 
                  width={1400}
                  height={1800}
                  className="max-w-full h-auto rounded-3xl shadow-2xl border border-white/10"
                  priority
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
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
