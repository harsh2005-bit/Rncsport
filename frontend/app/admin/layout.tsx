"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Landmark, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

const adminLinks = [
  { name: "Deposit Requests", href: "/admin/deposits", icon: LayoutDashboard },
  { name: "Withdraw Requests", href: "/admin/withdrawals", icon: Landmark },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-3xl hidden flex-col lg:flex z-50">
        <div className="p-8 border-b border-white/5 bg-white/2">
          <Link href="/admin" className="flex items-center gap-3 group">
             <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center font-black text-primary shadow-lg shadow-primary/10 group-hover:scale-110 transition-all">
                JSR
             </div>
             <div className="flex flex-col">
               <span className="font-black text-xs tracking-[0.3em] uppercase text-white/40 leading-none mb-1">Neural</span>
               <span className="font-black text-xl tracking-tighter uppercase text-white leading-none">Admin</span>
             </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-3 custom-scrollbar">
           <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] pl-4 mb-6 flex items-center gap-3">
              Control Hub
              <span className="h-px flex-1 bg-white/5" />
           </div>

           {adminLinks.map((link) => {
             const isActive = pathname === link.href;
             return (
               <Link
                 key={link.name}
                 href={link.href}
                 className={cn(
                   "flex items-center justify-between px-4 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border group relative overflow-hidden",
                   isActive 
                    ? "bg-primary text-black border-primary shadow-2xl shadow-primary/20" 
                    : "text-white/40 border-transparent hover:bg-white/5 hover:text-white"
                 )}
               >
                 <div className="flex items-center gap-4 relative z-10">
                   <div className={cn(
                     "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                     isActive ? "bg-black/10 text-black" : "bg-white/5 text-white/10 group-hover:text-primary"
                   )}>
                     <link.icon className="w-4 h-4" />
                   </div>
                   {link.name}
                 </div>
                 {isActive && (
                   <div className="absolute top-0 right-0 w-12 h-full bg-linear-to-l from-black/5 to-transparent pointer-events-none" />
                 )}
               </Link>
             );
           })}
        </div>

        <div className="p-8 border-t border-white/5 bg-white/2">
            <button 
              onClick={logout}
              className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-red-500/5 group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Exit Terminal
            </button>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Admin Header Content */}
        <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Authorized Session</span>
              <span className="text-sm font-bold text-white/50 italic tracking-tighter">Welcome, Super Admin Access</span>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Neural Link Active</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow">
                   <ShieldCheck className="w-5 h-5" />
                </div>
            </div>
        </header>

        {/* Page Content Body */}
        <div className="flex-1 p-6 lg:p-12 overflow-y-auto custom-scrollbar w-full bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.03),transparent_40%)]">
            {children}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.3); border-radius: 10px; }
        .shadow-glow { box-shadow: 0 0 20px rgba(251, 191, 36, 0.15); }
      `}</style>
    </div>
  );
}
