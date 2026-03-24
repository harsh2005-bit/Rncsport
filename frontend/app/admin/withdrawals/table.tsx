"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MessageCircle, X, Clock, Loader2, ArrowLeft, XCircle, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface WithdrawalRequest {
  id: string;
  name: string;
  phoneNumber: string;
  amount: number;
  paymentMethod: string;
  bankDetails: {
    accountNumber: string;
    ifsc: string;
    holderName: string;
  } | null;
  upiDetails: {
    upiId: string;
    qrImageUrl: string;
  } | null;
  credentials: {
    id: string;
    password?: string;
  };
  status: string;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

export default function AdminWithdrawalsTable({ adminKey }: { adminKey: string }) {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [isPending, startTransition] = useTransition();
  const [selectedDetails, setSelectedDetails] = useState<WithdrawalRequest | null>(null);

  const fetchWithdrawals = async (isInitial = false) => {
    try {
      const response = await fetch('/api/withdrawal', {
        headers: { 'x-admin-key': adminKey }
      });
      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data);
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(true);
    const interval = setInterval(() => fetchWithdrawals(false), 5000);
    return () => clearInterval(interval);
  }, [adminKey]);

  const updateStatus = async (id: string, status: string, adminNote?: string) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/withdrawal', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-key': adminKey
          },
          body: JSON.stringify({ id, status, adminNote })
        });
        
        if (response.ok) {
          setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
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

  const handleAction = () => {
     if(selectedDetails) {
        setSelectedDetails(null);
     }
  };

  const ObjectViewer = ({ obj }: { obj: Record<string, unknown> }) => (
     <div className="space-y-4 w-full p-4 bg-white/5 rounded-xl border border-white/10">
        {Object.entries(obj).map(([key, val]) => {
           if (val) {
             return (
               <div key={key} className="flex flex-col">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-sm font-bold text-white tracking-widest break-all font-mono">{String(val)}</span>
               </div>
             )
           }
        })}
     </div>
  );

  const filteredItems = withdrawals.filter(item => {
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
           Withdrawal <span className="text-yellow-400">Pannel</span>
         </h1>
         <p className="text-white/40 text-[9px] font-black tracking-[0.3em] uppercase mt-0.5">Approve Cash Out Requests</p>
      </div>

      <div className="bg-black/40 border border-yellow-400/20 rounded-3xl p-6 md:p-8 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10" />

        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-white/5">
          {filteredItems.length === 0 ? (
            <div className="text-center py-40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4">
               <Clock className="w-12 h-12 text-white/10" />
               <h2 className="text-xl font-black text-white/20 uppercase tracking-[0.5em]">System Idle</h2>
               <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest">No withdrawal requests found</p>
            </div>
          ) : (
            <table className="table-auto w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[9px] text-white/40 uppercase tracking-[0.3em] font-black font-inter">
                  <th className="px-4 py-2 whitespace-nowrap">Member Name</th>
                  <th className="px-4 py-2 whitespace-nowrap">Amount</th>
                  <th className="px-4 py-2 whitespace-nowrap">Method</th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">Details/Credentials</th>
                  <th className="px-4 py-2 whitespace-nowrap">Status</th>
                  <th className="px-4 py-2 text-right whitespace-nowrap">Actions</th>
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
                      <div className="text-[10px] text-white/40 font-mono tracking-widest">{item.phoneNumber}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-black text-lg text-primary font-mono tracking-tighter">
                        ₹{item.amount}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-[10px] uppercase text-white/60 tracking-wider">
                       {item.paymentMethod.replace("_", " ")}
                    </td>
                    <td className="px-4 py-4 text-center">
                       <button
                          onClick={() => setSelectedDetails(item)}
                          className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary text-white/60 hover:text-primary text-[9px] font-black uppercase tracking-widest transition-all"
                       >
                          View Secret Details
                       </button>
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
                               Approve
                             </button>
                             <button
                               onClick={() => {
                                 const note = prompt("Enter specific reason for rejection (optional):");
                                 updateStatus(item.id, "rejected", note || "Rejected by Admin");
                               }}
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
        {selectedDetails && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetails(null)}
              className="absolute inset-0 bg-black/98 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl max-h-[95vh] glass border-white/10 rounded-[2.5rem] bg-background shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col overflow-auto scrollbar-none"
            >
              <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/3 sticky top-0 z-10 backdrop-blur-md">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter italic font-cinzel">Confidential Request Data</h3>
                  <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest">Verify & Transfer Funds</p>
                </div>
                <button 
                  onClick={() => setSelectedDetails(null)}
                  className="p-3 bg-white/5 rounded-full text-white/20 hover:text-white transition-all border border-white/10 active:scale-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-8 pb-12">
                 
                 <div className="space-y-3">
                   <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] pb-1 border-b border-white/5 flex items-center gap-2">
                      <Lock className="w-3 h-3"/> Betting Credentials
                   </h4>
                   <ObjectViewer obj={selectedDetails.credentials} />
                 </div>

                 <div className="space-y-3">
                   <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] pb-1 border-b border-primary/20 flex items-center gap-2">
                       {selectedDetails.paymentMethod === 'UPI' ? 'UPI Transfer Info' : 'Bank Transfer Info'}
                   </h4>
                   {selectedDetails.bankDetails && <ObjectViewer obj={selectedDetails.bankDetails} />}
                   {selectedDetails.upiDetails && (
                      <div className="space-y-4">
                        <ObjectViewer obj={{ UPI_ID: selectedDetails.upiDetails.upiId || 'Not Provided' }}/>
                        {selectedDetails.upiDetails.qrImageUrl && (
                           <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-center">
                              <Image 
                                src={selectedDetails.upiDetails.qrImageUrl}
                                alt="User QR"
                                width={250}
                                height={250}
                                className="object-contain rounded-xl bg-white" 
                              />
                           </div>
                        )}
                      </div>
                   )}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function statusBadge(status: string) {
  const s = status?.toLowerCase();
  if (s === "approved") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
         <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 font-inter">Approved</span>
      </div>
    );
  }
  if (s === "rejected") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 w-fit">
         <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
         <span className="text-[9px] font-black uppercase tracking-widest text-red-500 font-inter">Rejected</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
       <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
       <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 font-inter">Pending</span>
    </div>
  );
}
