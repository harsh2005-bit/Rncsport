"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, ImageIcon, MessageCircle, X, ExternalLink, ShieldCheck, ShieldAlert, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
interface PaymentRequest {
  id: string;
  userId: string;
  name: string;
  phoneNumber: string;
  paymentMethod: 'UPI' | 'BANK_TRANSFER';
  platform: string;
  transactionId?: string | null;
  screenshotUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string | Date;
}

export default function AdminTable() {
  const [items, setItems] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newRowIds, setNewRowIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getAdminKey = () => sessionStorage.getItem("jsr_admin_key") || "";

  const fetchRequests = async (isInitial = false) => {
    if (!isInitial) setIsRefreshing(true);
    try {
      const response = await fetch('/api/payment');
      const data = await response.json();
      if (response.ok) {
        if (!isInitial) {
          // Identify new submissions to highlight them
          const currentIds = new Set(items.map(item => item.id));
          const newIds = data
            .filter((item: PaymentRequest) => !currentIds.has(item.id))
            .map((item: PaymentRequest) => item.id);
          
          if (newIds.length > 0) {
            setNewRowIds(new Set(newIds));
            // Remove highlight after 5 seconds
            setTimeout(() => setNewRowIds(new Set()), 5000);
          }
        }
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      if (isInitial) setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests(true);
    
    // Auto refresh every 12 seconds
    const interval = setInterval(() => {
      fetchRequests(false);
    }, 12000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = (id: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/payment', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, status })
        });
        
        if (res.ok) {
          setItems((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: status as "APPROVED" | "REJECTED" } : r))
          );
        } else {
          const errorData = await res.json();
          alert(`Failed to update status: ${errorData.error}`);
        }
      } catch (error: any) {
        alert(`Failed to update status: ${error.message}`);
      }
    });
  };

  const getImageUrl = (screenshotUrl: string) => {
    return screenshotUrl;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-xs font-black text-white/20 uppercase tracking-[0.5em]">Loading Records...</p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/5 border border-white/10 rounded-[2.5rem] p-4 md:p-8 backdrop-blur-sm relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-3 text-white uppercase italic tracking-tighter font-cinzel">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Verification Center
          </h2>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black mt-1">Manage Elite Member Transactions</p>
        </div>
        {(isPending || isRefreshing) && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] text-primary font-black uppercase tracking-widest">
              {isPending ? "Updating..." : "Syncing..."}
            </span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle md:px-0">
          <table className="min-w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black underline decoration-primary/20 underline-offset-8">
                <th className="px-6 pb-4">User Details</th>
                <th className="px-6 pb-4">Transaction</th>
                <th className="px-6 pb-4 text-center">Screenshot</th>
                <th className="px-6 pb-4">Status</th>
                <th className="px-6 pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {items.map((r) => (
                <tr
                  key={r.id}
                  className={cn(
                    "bg-white/3 hover:bg-white/5 border border-white/5 transition-all group",
                    newRowIds.has(r.id) && "ring-2 ring-primary/50 bg-primary/10 animate-pulse"
                  )}
                >
                  <td className="py-5 px-6 rounded-l-3xl">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-white uppercase tracking-tight">{r.name}</span>
                      <span className="text-[11px] text-white/40 font-medium">{r.phoneNumber}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/60 text-[10px] font-black tracking-widest uppercase">
                          {r.paymentMethod}
                        </span>
                        <span className="text-[11px] text-white/80 font-mono tracking-wider">{r.transactionId || "N/A"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-primary/60 font-black uppercase tracking-widest bg-primary/5 border border-primary/10 px-2 py-0.5 rounded w-fit mb-1">
                          {r.platform || "All Panel Exch"}
                        </span>
                        <span className="text-[10px] text-white/30 font-bold flex items-center gap-1 uppercase">
                          <Clock className="w-3 h-3" />
                          {new Date(r.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <button 
                      onClick={() => setSelectedImage(getImageUrl(r.screenshotUrl))}
                      className="relative w-16 h-20 md:w-20 md:h-24 mx-auto rounded-xl overflow-hidden border border-white/10 group-hover:border-primary/40 transition-all hover:scale-105"
                    >
                      <Image 
                        src={getImageUrl(r.screenshotUrl)} 
                        alt="Payment Proof" 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 64px, 80px"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col gap-1">
                      {r.status === "APPROVED" ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                        </div>
                      ) : r.status === "REJECTED" ? (
                        <div className="flex items-center gap-2 text-red-400">
                          <ShieldAlert className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Declined</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-5 px-6 text-right rounded-r-3xl space-x-2">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/${r.phoneNumber.startsWith("+") ? r.phoneNumber.substring(1) : r.phoneNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-primary hover:bg-primary/10 border border-white/10 hover:border-primary/20 transition-all"
                        title="Contact User"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      
                      {r.status === "PENDING" ? (
                        <>
                          <button
                            onClick={() => updateStatus(r.id, "APPROVED")}
                            disabled={isPending}
                            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Verify</span>
                          </button>
                          <button
                            onClick={() => updateStatus(r.id, "REJECTED")}
                            disabled={isPending}
                            className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all cursor-pointer"
                            title="Reject"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
                           <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Processed</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && !loading && (
            <div className="text-center py-20 bg-white/3 rounded-3xl border border-white/5 border-dashed">
               <p className="text-sm text-white/20 font-black uppercase tracking-widest">No payment records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] glass border-white/10 rounded-[2.5rem] bg-background shadow-3xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <ImageIcon className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Payment Screenshot</h3>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Proof of Transaction</p>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-black/40">
                <Image 
                  src={selectedImage} 
                  alt="Full Payment Proof" 
                  width={1200}
                  height={1600}
                  className="max-w-full h-auto rounded-xl shadow-2xl border border-white/10"
                  priority
                />
              </div>

              <div className="p-6 border-t border-white/5 bg-white/2 flex justify-center">
                 <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">JSR SPORTS VERIFICATION SYSTEM</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

