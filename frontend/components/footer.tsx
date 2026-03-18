import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, MessageCircle, Send, AlertTriangle } from "lucide-react";

export function Footer() {
  const WHATSAPP_LINK = "https://wa.me/447735378047?text=" + encodeURIComponent("Hello JSR SPORTS support, I need assistance with my betting ID.");

  return (
    <footer className="mt-auto border-t border-white/5 bg-background pt-32 pb-16 px-10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
        <div className="space-y-10 md:col-span-2">
          <Link href="/" className="relative block w-64 h-24 hover:scale-105 transition-transform">
            <Image 
              src="/logo.jpg" 
              alt="JSR SPORTS Logo" 
              fill 
              className="object-contain"
            />
          </Link>
          <p className="text-white/30 text-lg font-light max-w-lg leading-relaxed font-poppins">
            India&apos;s most sophisticated digital arena for premium betting ID access. For over a decade, we have provided the official gateways to the world&apos;s most liquid exchanges.
          </p>
          <div className="flex flex-wrap gap-6 pt-6">
             <div className="flex items-center gap-3 p-5 glass rounded-[2rem] border border-primary/20">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Quantum Encryption Active</span>
             </div>
             <div className="flex items-center gap-3 p-5 glass rounded-[2rem] border border-white/10">
                  <AlertTriangle className="w-6 h-6 text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Responsible Play Policy</span>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="font-black text-xs uppercase tracking-[0.5em] text-white/60 font-cinzel">Navigation</h4>
          <ul className="space-y-5 text-sm text-white/30 font-black uppercase tracking-widest">
            <li><Link href="/" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"/> Elite Arenas</Link></li>
            <li><Link href="/sports" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"/> Scoreboard</Link></li>
            <li><Link href={WHATSAPP_LINK} className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"/> VIP Syndicate</Link></li>
            <li><Link href="/get-id" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"/> Request Elite ID</Link></li>
          </ul>
        </div>

        <div className="space-y-8">
           <h4 className="font-black text-xs uppercase tracking-[0.5em] text-white/60 font-cinzel">Direct Connect</h4>
           <div className="space-y-4">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between bg-primary text-black py-6 px-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-primary/20 mb-4">
                WhatsApp Support <MessageCircle className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform" />
              </a>
              <a href="https://t.me/jsrsports" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between glass border-white/10 text-white py-6 px-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                Official Channel <Send className="w-6 h-6" />
              </a>
           </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="space-y-4 text-center lg:text-left">
           <p className="text-[11px] text-white/20 font-black uppercase tracking-[0.6em] flex items-center justify-center lg:justify-start gap-4">
               <span className="w-2 h-2 rounded-full bg-primary/20 animate-pulse" />
               © {new Date().getFullYear()} JSR SPORTS. GLOBAL OPERATIONS ACTIVE.
           </p>
           <p className="text-[10px] text-white/10 font-medium max-w-2xl">
             Notice: This infrastructure provides official gateway access for verified participants only. Digital security and responsible play are embedded at the core of all operations.
           </p>
        </div>
        <div className="flex items-center gap-8">
           <p className="text-[11px] text-primary font-black bg-primary/10 px-8 py-3 rounded-full border border-primary/20 uppercase tracking-[0.4em] shadow-xl shadow-primary/5">
               1 POINT = ₹1
           </p>
        </div>
      </div>
    </footer>
  );
}
