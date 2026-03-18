"use client";

import { motion } from "framer-motion";
import { 
  Gamepad2, 
  Dices, 
  Zap, 
  Layers, 
  Play
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const games = [
  { id: "crash", name: "Crash", type: "Original", icon: Zap, color: "text-red-500", bg: "bg-red-500/10", image: "/crash_thumb.png" },
  { id: "dice", name: "Dice", type: "Original", icon: Dices, color: "text-blue-500", bg: "bg-blue-500/10", image: "/dice_thumb.png" },
  { id: "mines", name: "Mines", type: "Original", icon: Layers, color: "text-primary", bg: "bg-primary/20", image: "/mines_thumb.png" },
  { id: "plinko", name: "Plinko", type: "Original", icon: Gamepad2, color: "text-yellow-500", bg: "bg-yellow-500/10", image: "/casino_hero_banner_1772297386064.png" },
  { id: "slots", name: "Slots", type: "Premium", icon: Gamepad2, color: "text-accent", bg: "bg-accent/20", image: "/slots_thumb.png" },
];

export default function CasinoPage() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const handleGetId = () => {
    if (!user) {
      openAuthModal();
    } else {
      router.push("/get-id");
    }
  };
  return (
    <div className="space-y-20 pb-20">
      <section className="relative p-12 lg:p-20 glass rounded-[4rem] border border-white/10 overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 group-hover:bg-secondary/20 transition-all duration-1000" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 glass border-primary/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Live Global Marketplace</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter font-cinzel leading-none uppercase">
              GRAND <span className="text-gradient-primary">ORIGINALS</span>
            </h1>
            <p className="text-white/40 text-xl font-light max-w-2xl leading-relaxed font-poppins">
              Authentic, provably fair gaming protocols designed for the high-limit elite. Experience transparency powered by the JSR-VAULT.
            </p>
          </div>
          <div className="flex bg-white/5 p-2 rounded-4xl border border-white/10 backdrop-blur-3xl shadow-2xl">
            <button className="px-8 py-4 bg-primary text-black font-black text-xs rounded-3xl shadow-xl shadow-primary/20 transition-all hover:scale-105">Verified Originals</button>
            <button className="px-8 py-4 font-black text-xs text-white/30 hover:text-white transition-all">Elite Favorites</button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {games.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -12 }}
            className="group relative glass border-white/10 rounded-[3rem] overflow-hidden cursor-pointer flex flex-col card-hover"
          >
            <div className="relative h-56 overflow-hidden">
              <Image 
                src={game.image} 
                alt={game.name} 
                fill 
                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-90" />
              <div className={cn("absolute top-6 left-6 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-3xl border border-white/20 shadow-2xl", game.bg)}>
                <game.icon className={cn("w-6 h-6", game.color)} />
              </div>
            </div>
            
            <div className="p-8 space-y-6 relative">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50 font-cinzel">{game.type}</p>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase font-cinzel group-hover:text-primary transition-colors">{game.name}</h3>
                </div>
              </div>
              
              <button 
                onClick={handleGetId}
                className="w-full flex items-center justify-between bg-primary group-hover:bg-primary/90 text-black font-black py-5 px-6 rounded-2xl md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 shadow-2xl shadow-primary/10"
              >
                <span className="text-[11px] uppercase tracking-[0.3em]">Execute Play</span>
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="relative glass rounded-[4rem] border border-white/10 p-16 md:p-24 flex flex-col md:flex-row items-center gap-20 overflow-hidden group">
        <div className="absolute inset-0 bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex-1 space-y-10 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 glass border-accent/20 text-accent rounded-full mb-4">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Quantum Fairness Integration</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none uppercase font-cinzel">Mathematical <br/><span className="text-gradient-primary">Integrity</span></h2>
          <p className="text-white/40 text-xl font-light max-w-2xl leading-relaxed font-poppins">
            Every outcome is generated via cryptographic hashing protocols. Pre-determined, immutable, and strictly verifiably fair on the global ledger.
          </p>
          <button className="px-12 py-5 bg-white/10 hover:bg-white/20 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl border border-white/10 transition-all shadow-xl hover:scale-105 active:scale-95 group-hover:border-primary/30">
            Verify Protocol
          </button>
        </div>
        <div className="relative w-full max-w-sm aspect-square glass rounded-full border border-white/5 flex items-center justify-center overflow-hidden shadow-[0_0_100px_rgba(251,191,36,0.05)]">
           <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent animate-pulse" />
           <ShieldCheck className="w-48 h-48 text-primary opacity-30 animate-pulse" />
        </div>
      </section>
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  );
}
