"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { 
  Gamepad2, 
  Trophy, 
  Headset,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Gamepad2, label: "Casino", href: "/casino" },
  { icon: Trophy, label: "Sports", href: "/sports" },
];

const secondaryItems = [
  { icon: Headset, label: "Support", href: "/support" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const handleGetId = () => {
    if (!user) {
      openAuthModal();
    } else {
      router.push("/get-id");
    }
  };

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-64 glass border-r border-white/5 p-5 hidden lg:flex flex-col gap-6 transition-all duration-500 z-40">
      <div className="flex flex-col gap-3 relative z-10">
        <p className="text-[9px] font-black text-white/20 px-4 uppercase tracking-[0.4em] mb-1 flex items-center gap-3">
           COCKPIT
           <span className="h-px flex-1 bg-white/5" />
        </p>
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-500 group overflow-hidden border border-transparent",
                  isActive 
                    ? "text-white bg-primary/10 border-primary/20 shadow-[0_0_20px_rgba(251,191,36,0.15)]" 
                    : "text-white/40 hover:text-white hover:bg-white/5 hover:border-[#fbbf24]/30"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent pointer-events-none" 
                  />
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500",
                    isActive ? "bg-primary text-black" : "bg-white/5 text-white/20 group-hover:text-white"
                  )}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-widest">{item.label}</span>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-all duration-500 relative z-10",
                  isActive ? "opacity-100 text-primary" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-warning"
                )} />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <p className="text-[10px] font-black text-white/20 px-4 uppercase tracking-[0.4em] mb-2 flex items-center gap-4">
           GRID
           <span className="h-px flex-1 bg-white/5" />
        </p>
        <div className="space-y-2">
          {secondaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 text-white/40 hover:text-white hover:bg-white/5 group border border-transparent hover:border-white/10"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 text-white/20 flex items-center justify-center group-hover:text-white transition-all">
                <item.icon className="w-4 h-4" />
              </div>
              <span className="font-black text-[10px] uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto relative p-6 bg-linear-to-br from-primary/20 via-background to-secondary/10 border border-white/10 rounded-4xl overflow-hidden group shadow-2xl">
        <div className="absolute right-[-20%] top-[-20%] w-40 h-40 bg-primary/20 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/30 transition-all" />
        <div className="relative z-10 space-y-4">
          <div className="space-y-1">
            <p className="text-lg font-black text-white italic tracking-tighter uppercase leading-none font-cinzel">Elite <br/><span className="text-primary text-xl font-bold not-italic">BONUS</span></p>
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] leading-relaxed">
              10% on new ID activation & 5% on all refills.
            </p>
          </div>
          <button 
            onClick={handleGetId}
            className="w-full py-3 bg-linear-to-r from-[#fbbf24] to-[#f59e0b] text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-lg flex items-center justify-center transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(251,191,36,0.45)]"
          >
            Get ID
          </button>
        </div>
      </div>
    </aside>
  );
}
