"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Coins, MessageSquare } from "lucide-react";

export interface SEOLandingTemplateProps {
  title: string;
  subtitle: string;
  intro: string;
  contentSections: {
    heading: string;
    paragraphs: string[];
  }[];
}

const WHATSAPP_URL = "https://wa.me/447735378047";
const WHATSAPP_MSG = encodeURIComponent("Hello JSR SPORTS, I want a betting ID.");
const WHATSAPP_LINK = `${WHATSAPP_URL}?text=${WHATSAPP_MSG}`;

export function SEOLandingTemplate({ title, subtitle, intro, contentSections }: SEOLandingTemplateProps) {
  return (
    <div className="space-y-16 pb-32 pt-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter font-cinzel text-gradient-gold">
          {title}
        </h1>
        <h2 className="text-xl text-primary font-bold uppercase tracking-widest font-poppins">
          {subtitle}
        </h2>
        <p className="text-white/60 max-w-3xl mx-auto leading-relaxed font-poppins text-lg">
          {intro}
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href={WHATSAPP_LINK}
            target="_blank"
            className="px-8 py-4 bg-primary text-black font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            Get Your ID Now <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/"
            className="px-8 py-4 glass text-white font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/5 transition-all flex items-center gap-2"
          >
            Explore Platform
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
        {[
          { icon: ShieldCheck, title: "100% Secure" },
          { icon: Zap, title: "Instant Access" },
          { icon: Coins, title: "Fast Withdrawals" },
          { icon: MessageSquare, title: "24/7 Support" }
        ].map((feat, i) => (
          <div key={i} className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-4 border border-white/5 hover:border-primary/20 transition-colors">
            <feat.icon className="w-10 h-10 text-primary" />
            <h3 className="font-bold text-white uppercase tracking-widest font-cinzel">{feat.title}</h3>
          </div>
        ))}
      </section>

      {/* Content */}
      <section className="space-y-12">
        {contentSections.map((sec, i) => (
          <div key={i} className="space-y-6">
            <h2 className="text-3xl font-black text-white italic tracking-tighter font-cinzel">{sec.heading}</h2>
            <div className="space-y-4 text-white/50 leading-relaxed font-poppins">
              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Process */}
      <section className="glass rounded-[3rem] p-12 border border-white/5 text-center space-y-8">
         <h2 className="text-4xl font-black text-white italic tracking-tighter font-cinzel">START WINNING TODAY</h2>
         <p className="text-white/50 max-w-2xl mx-auto font-poppins">
           Our process is designed for your convenience. Get started in less than 2 minutes. Secure your betting ID through our trusted network.
         </p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
               <div className="text-3xl font-black text-primary font-cinzel mb-4">01</div>
               <h3 className="font-bold text-white uppercase">Message Us</h3>
               <p className="text-sm text-white/40">Connect via WhatsApp for instant support.</p>
            </div>
            <div className="space-y-2">
               <div className="text-3xl font-black text-primary font-cinzel mb-4">02</div>
               <h3 className="font-bold text-white uppercase">Deposit & Verify</h3>
               <p className="text-sm text-white/40">Fast UPI deposits with immediate approval.</p>
            </div>
            <div className="space-y-2">
               <div className="text-3xl font-black text-primary font-cinzel mb-4">03</div>
               <h3 className="font-bold text-white uppercase">Play & Withdraw</h3>
               <p className="text-sm text-white/40">Enjoy premium exchanges and instant payouts.</p>
            </div>
         </div>
      </section>
    </div>
  );
}
