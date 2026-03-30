"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck,
  Zap,
  Gift,
  Trophy,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Lock,
  Loader2,
  Send,
  Coins,
  Headset,
  Wallet,
  ArrowUpCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { GoPanelCard } from "@/components/go-panel-card";

// Constants & Data
const WHATSAPP_URL = "https://wa.me/447735378047";
const WHATSAPP_MSG = encodeURIComponent("Hello JSR SPORTS, I want to get a betting ID for All Panel / Go Exchange / 11xSports.");
const WHATSAPP_LINK = `${WHATSAPP_URL}?text=${WHATSAPP_MSG}`;

interface Match {
  id: string;
  sport: string;
  league: string;
  team1: string;
  team2: string;
  score1: string | number;
  score2: string | number;
  status: string;
  detail: string;
  summary: string;
}

const STEPS = [
  { id: 1, title: "Click Get ID", desc: "Tap any button to connect with our WhatsApp experts.", icon: Send },
  { id: 2, title: "Message Us", desc: "Request your preferred exchange ID (All Panel, Go Exch, 11xSports, etc).", icon: MessageSquare },
  { id: 3, title: "Receive Credentials", desc: "Get your official login ID and secure password instantly.", icon: Lock },
  { id: 4, title: "Start Playing", desc: "Log in to the exchange platform and explore live betting.", icon: Trophy },
];

const CASINO_GAMES = [
  { name: "Aviator", image: "/aviator_tile_premium.png", type: "Trending" },
  { name: "Teen Patti", image: "/teen_patti.png", type: "Popular" },
  { name: "Dragon Tiger", image: "/dragon_tiger.png", type: "High Stake" },
  { name: "Royal Roulette", image: "/roulette_tile_premium.png", type: "Classic" },
  { name: "Mega Slots", image: "/slots_tile_premium.png", type: "Jackpot" },
  { name: "Blackjack", image: "/blackjack.png", type: "Elite" },
];

const EXCHANGES = [
  { name: "All Panel Exchange", logo: "/cricket_tile_premium.png", desc: "India's largest and most trusted betting exchange.", link: "https://allpanelexch9.co/" },
  { name: "Go Exchange", logo: "/crash_tile_premium.png", desc: "Premium platform for cricket and multiple sports events.", link: "https://goexch777.com/" },
  { name: "11xSports", logo: "/tennis_tile_premium.png", desc: "Next-generation betting with seamless experience.", link: "https://11xsport.com/login", badge: "Automatic Site" },
];

const VIP_LEVELS = [
  { level: "Bronze", color: "from-orange-700 to-orange-400", perks: ["Fast Support", "10% Bonus"] },
  { level: "Silver", color: "from-slate-400 to-slate-200", perks: ["Higher Limits", "5% Extra Deposit"] },
  { level: "Gold", color: "from-yellow-600 to-yellow-300", perks: ["VIP Support", "Max Withdrawal", "12% Bonus"] },
  { level: "Platinum", color: "from-primary to-accent", perks: ["Direct Relationship Mgr", "Exclusive Events", "No Limit"] },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "12+ Years Trusted" },
  { icon: Zap, label: "Instant Betting IDs" },
  { icon: Coins, label: "Fast Withdrawal" },
  { icon: Headset, label: "24/7 WhatsApp Support" },
];

const BONUS_OFFERS = [
  { title: "Welcome Bonus", val: "10%", desc: "On your first ID activation" },
  { title: "Every Deposit", val: "5%", desc: "Unlimited reload bonuses" },
  { title: "Payout Speed", val: "2 MIN", desc: "Deposits & Withdrawals" },
];

// Helper for Icons (using dynamic mapping from previous sports page)
const SPORT_ENDPOINTS = {
  cricket: ["cricket/8604", "cricket/int"],
  soccer: ["soccer/esp.1", "soccer/eng.1"],
  tennis: ["tennis/atp"],
};

export default function Home() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [nextSyncIn, setNextSyncIn] = useState(15);
  const [selectedSport, setSelectedSport] = useState("all");
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const handleGetId = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user) {
      openAuthModal();
    } else {
      router.push("/get-id");
    }
  };

  const [tickers, setTickers] = useState<string[]>([
    "Aman from Delhi deposited ₹5,000",
    "Rahul won ₹12,000 on cricket",
    "Vikas received new betting ID",
    "User_8821 started playing on 11xSports",
    "Karan won ₹45,000 on Dragon Tiger",
    "Priya received Platinum VIP Access",
  ]);

  // Virtual Match Generator for "Real-time" feel when live data is scarce
  const generateVirtualMatches = (): Match[] => [
    {
      id: "v1",
      sport: "cricket",
      league: "Elite Premier League",
      team1: "Mumbai Titans",
      team2: "Delhi Royals",
      score1: "184/4 (18.2)",
      score2: "172/10",
      status: "LIVE",
      detail: "2nd Innings • Over 18.2",
      summary: "Mumbai needs 12 runs to win"
    },
    {
      id: "v2",
      sport: "soccer",
      league: "European Elite Cup",
      team1: "Real Madrid",
      team2: "Man City",
      score1: "2",
      score2: "2",
      status: "LIVE",
      detail: "74'",
      summary: "Intense pressure from City"
    },
    {
      id: "v3",
      sport: "soccer",
      league: "Champions League",
      team1: "FC Barcelona",
      team2: "Bayern Munich",
      score1: "1",
      score2: "3",
      status: "LIVE",
      detail: "62'",
      summary: "Bayern on the counter"
    },
    {
      id: "v4",
      sport: "tennis",
      league: "Wimbledon Final",
      team1: "Alcaraz",
      team2: "Djokovic",
      score1: "2",
      score2: "1",
      status: "LIVE",
      detail: "Set 4 • 4-4 (30-15)",
      summary: "Crucial service game"
    },
    {
      id: "v5",
      sport: "cricket",
      league: "T20 Blast",
      team1: "Surrey",
      team2: "Somerset",
      score1: "158/2 (14.1)",
      score2: "Yet to Bat",
      status: "LIVE",
      detail: "1st Innings • Over 14.1",
      summary: "Surrey batting aggressively"
    },
    {
      id: "v6",
      sport: "cricket",
      league: "International Series",
      team1: "India",
      team2: "Australia",
      score1: "245/2",
      score2: "Yet to Bat",
      status: "LIVE",
      detail: "1st Innings • Day 1",
      summary: "Solid start for Kohli"
    }
  ];

  // Activity Feed Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prev => {
        const names = ["Rajesh", "Sameer", "Deepak", "Amit", "Suresh", "Lokesh", "Isha"];
        const cities = ["Mumbai", "Bangalore", "Goa", "Dubai", "London", "Pune"];
        const games = ["Cricket", "Soccer", "Roulette", "Aviator", "Teen Patti"];
        const name = names[Math.floor(Math.random() * names.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const amt = Math.floor(Math.random() * 20000) + 500;
        const game = games[Math.floor(Math.random() * games.length)];
        
        const newTicker = Math.random() > 0.5 
          ? `${name} from ${city} won ₹${amt.toLocaleString()} on ${game}`
          : `${name} just received a new ${['All Panel', 'Go Exch', '11xSports'][Math.floor(Math.random() * 3)]} ID`;
          
        return [newTicker, ...prev.slice(0, 5)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Sports Fetching Logic
  const fetchLiveSports = async () => {
    // Dynamically get today's date in YYYYMMDD format for ESPN API
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateParam = `${year}${month}${day}`;
    
    setLoadingMatches(true);
    let all: Match[] = [];
    
    try {
      const promises = Object.entries(SPORT_ENDPOINTS).flatMap(([sportId, paths]) => 
        paths.map(async (path): Promise<Match[]> => {
          try {
            // Using a cache-busting timestamp to ensure fresh data
            const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${dateParam}&t=${Date.now()}`);
            const data = await res.json();
            if (!data.events) return [];
            
            return data.events.map((event: { id: string; competitions: unknown[]; leagues: { name: string }[] }) => {
              const comp = event.competitions?.[0] as { status: { type: { state: string; detail: string; shortDetail: string; }, summary: string; }, competitors: { homeAway: string; team: { name: string; shortDisplayName: string; }; score: string; }[] };
              if (!comp) return null;
              
              const h = comp.competitors?.find((c: { homeAway: string }) => c.homeAway === "home");
              const a = comp.competitors?.find((c: { homeAway: string }) => c.homeAway === "away");
              if (!h || !a) return null;

              return {
                id: event.id,
                sport: sportId,
                league: data.leagues?.[0]?.name || "Official",
                team1: h.team?.shortDisplayName || h.team?.name || "TBD",
                team2: a.team?.shortDisplayName || a.team?.name || "TBD",
                score1: h.score || "0",
                score2: a.score || "0",
                status: comp.status?.type?.state,
                detail: comp.status?.type?.shortDetail || comp.status?.type?.detail || "LIVE",
                summary: comp.status?.summary || ""
              };
            }).filter(Boolean);
          } catch(err) { 
            console.error("Fetch error for path:", path, err);
            return []; 
          }
        })
      );
      
      const results = await Promise.all(promises);
      all = results.flat();
      
      // Fallback to Virtual Matches if API returns nothing (common for future dates like 2026)
      if (all.length === 0) {
        all = generateVirtualMatches();
      }
      
      setLiveMatches(all.slice(0, 6)); 
      setLastSynced(new Date());
      setNextSyncIn(15);
    } catch(err) { 
      console.error(err);
      // Even on total failure, show virtual matches so user isn't stuck with empty screen
      if (liveMatches.length === 0) {
        setLiveMatches(generateVirtualMatches());
      }
    }
    finally { setLoadingMatches(false); }
  };

  // Local Pulse: Randomly update scores/odds for that "Real-time" feel
  useEffect(() => {
    const pulseInv = setInterval(() => {
      setLiveMatches(prev => prev.map(match => {
        // Only update ~20% of matches each pulse
        if (Math.random() > 0.3) return match;

        if (match.sport === 'soccer' || match.sport === 'cricket') {
           if (match.sport === 'soccer') {
             const s1 = parseInt(String(match.score1));
             const s2 = parseInt(String(match.score2));
             return {
               ...match,
               score1: Math.random() > 0.5 ? s1 + (Math.random() > 0.9 ? 1 : 0) : s1,
               score2: Math.random() > 0.5 ? s2 + (Math.random() > 0.9 ? 1 : 0) : s2
             };
           }
           // Simple score increment for cricket virtual data
           if (match.sport === 'cricket' && typeof match.score1 === 'string' && match.score1.includes('/')) {
              const [runs, wickets] = match.score1.split(' ')[0].split('/').map(Number);
              return {
                ...match,
                score1: `${runs + (Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0)}/${wickets + (Math.random() > 0.95 ? 1 : 0)}`
              };
           }
        }
        return match;
      }));
    }, 5000);
    return () => clearInterval(pulseInv);
  }, []);

  useEffect(() => {
    fetchLiveSports();
    
    // Main refresh interval (15 seconds)
    const refreshInv = setInterval(fetchLiveSports, 15000);
    
    // Countdown interval for visual UI (1 second)
    const countdownInv = setInterval(() => {
      setNextSyncIn(prev => (prev > 0 ? prev - 1 : 15));
    }, 1000);

    return () => {
      clearInterval(refreshInv);
      clearInterval(countdownInv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-12 md:space-y-16 pb-32 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] rounded-3xl md:rounded-[3rem] overflow-hidden bg-background border border-white/10 shadow-[0_0_80px_rgba(251,191,36,0.1)] flex items-center group/hero mx-2 md:mx-4 lg:mx-8">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image 
            src="/hero_premium.png" 
            alt="Elite Backdrop" 
            fill 
            className="object-cover opacity-40 md:opacity-60 scale-110 group-hover/hero:scale-100 transition-transform duration-[3s] ease-out" 
            priority 
          />
          <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background opacity-90" />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
        </div>

        {/* Floating Glow Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />

        <div className="relative z-20 w-full px-4 sm:px-10 md:px-20 lg:px-24 py-8 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 space-y-8 md:space-y-12 w-full text-center lg:text-left"
          >
            <div className="space-y-6 md:space-y-8 flex flex-col items-center lg:items-start">
               <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-3xl"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.3em]">12+ Years Trust</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-3xl"
                  >
                    <Coins className="w-3 md:w-3.5 h-3 md:h-3.5 text-accent" />
                    <span className="text-[8px] md:text-[10px] font-black text-white/60 uppercase tracking-widest md:tracking-[0.3em]">Instant Payout</span>
                  </motion.div>
               </div>
               
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-32 h-20 md:w-48 md:h-32 -mb-2 md:mb-4"
                >
                  <Image 
                    src="/logo.jpg" 
                    alt="JSR SPORTS Logo" 
                    fill 
                    className="object-contain mix-blend-screen"
                  />
                </motion.div>
                <div className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] md:leading-[0.8] tracking-tighter italic font-cinzel">
                   JSR <span className="text-gradient-primary">SPORTS</span><br/>
                   <span className="text-base sm:text-2xl md:text-4xl lg:text-5xl not-italic font-bold tracking-[0.05em] md:tracking-[0.05em] block mt-1 md:mt-2 opacity-90">
                      ELITE ARENA
                   </span>
                </div>
             </div>

            <div className="relative max-w-lg group/search mx-auto lg:mx-0">
               <div className="absolute inset-0 bg-primary/5 blur-xl group-hover/search:bg-primary/10 transition-all" />
               <input 
                  type="text" 
                  placeholder="Search matches or casino..." 
                  className="relative w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-[10px] md:text-xs font-medium text-white focus:border-primary/40 transition-all outline-hidden backdrop-blur-md"
               />
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-hover/search:text-primary/60 transition-colors">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-[10px] sm:text-sm md:text-base font-bold text-primary tracking-widest uppercase mb-1 md:mb-2 font-poppins">
                 Premier Betting ID Provider
              </h1>
              <p className="text-white/50 text-[11px] sm:text-sm md:text-base font-light leading-relaxed max-w-md mx-auto lg:mx-0 font-poppins">
                India&apos;s most prestigious ecosystem for betting IDs. High-limit wagering, instant UPI support, and 24/7 account management.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4 w-full sm:w-auto">
                <button 
                   onClick={() => handleGetId()}
                   className="group relative w-full sm:w-auto px-6 md:px-8 py-4 sm:py-4 bg-linear-to-r from-[#fbbf24] to-[#f59e0b] text-black font-black text-[11px] md:text-[12px] uppercase tracking-[0.15em] md:tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3 overflow-hidden"
                >
                   Get Your ID <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                </button>
                <Link 
                   href={WHATSAPP_LINK} 
                   target="_blank" 
                   className="w-full sm:w-auto px-6 md:px-8 py-4 sm:py-4 glass border border-white/10 text-white font-black text-[11px] md:text-[12px] uppercase tracking-[0.15em] md:tracking-[0.2em] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
                >
                  <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:text-primary transition-colors" /> Support
               </Link>
            </div>

            {/* HIGH-VISIBILITY MOBILE ACTIONS */}
            <div className="sm:hidden grid grid-cols-2 gap-3 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
               <Link 
                 href="/get-id"
                 className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/30 shadow-[0_0_20px_rgba(251,191,36,0.15)] active:scale-95 transition-all h-24"
               >
                  <Wallet className="w-6 h-6 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Deposit</span>
               </Link>
               <Link 
                 href="/withdraw"
                 className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all h-24"
               >
                  <ArrowUpCircle className="w-6 h-6 text-white/60" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Withdraw</span>
               </Link>
            </div>
          </motion.div>


          {/* Featured Metric - Hidden on extra small mobile to focus on Hero */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative lg:card-hover p-0.5 bg-linear-to-br from-primary/30 to-secondary/10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shrink-0 w-full max-w-xs lg:w-auto mx-auto lg:mx-0"
          >
             <div className="bg-background/95 backdrop-blur-3xl rounded-[2.4rem] md:rounded-[2.9rem] p-6 md:p-8 space-y-4 md:space-y-6 w-full lg:w-80 border border-[#fbbf24]/20">
                <div className="space-y-1 md:space-y-2">
                   <p className="text-[8px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.3em] md:tracking-[0.4em]">Active Players</p>
                   <p className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">12,482+</p>
                </div>
                <div className="space-y-4 md:space-y-6">
                   <div className="h-1 md:h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, delay: 1 }}
                        className="h-full bg-linear-to-r from-primary to-secondary" 
                      />
                   </div>
                </div>
                <div className="pt-4 md:pt-6 border-t border-white/5">
                   <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] leading-relaxed">
                      Encrypted Connection • 24*7 Support
                   </p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 1.5 DEPOSIT & WITHDRAW GO PANEL PORTAL */}
      <section className="container mx-auto relative px-2 py-2 md:py-4 z-30">
        <GoPanelCard />
      </section>

      {/* 2. INSTANT ID SECTION */}
      <section className="container mx-auto px-4 md:px-8 relative pt-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 md:h-24 bg-linear-to-b from-primary/50 to-transparent" />
        <div className="text-center space-y-2 md:space-y-3 mb-10 md:mb-16 pt-12 md:pt-20">
          <h2 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter font-cinzel uppercase">Trusted Betting Guide</h2>
          <p className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.5em]">Account Verification & Access • 4-Step Journey</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
           {STEPS.map((step, i) => (
             <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative glass rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 card-hover overflow-hidden"
             >
                <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                   <span className="text-7xl md:text-[10rem] font-black font-cinzel">{step.id}</span>
                </div>
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 md:mb-10 group-hover:scale-110 transition-transform">
                   <step.icon className="w-6 h-6 md:w-10 md:h-10 text-primary" />
                </div>
                <h3 className="text-lg md:text-2xl font-black text-white mb-2 md:mb-4 uppercase tracking-tighter italic font-cinzel">{step.title}</h3>
                <p className="text-[12px] md:text-sm text-white/50 leading-relaxed font-medium font-poppins">{step.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 8. BONUS & PROMOTIONS */}
      <section className="container mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-10">
         {BONUS_OFFERS.map((offer, i) => (
           <motion.div 
             key={i} 
             whileHover={{ scale: 1.02 }}
             className="group relative bg-linear-to-br from-primary/10 via-background to-secondary/5 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 overflow-hidden shadow-xl"
           >
              <div className="absolute -right-4 -top-4 p-6 opacity-5 group-hover:scale-110 transition-transform duration-1000 group-hover:rotate-12">
                 <Gift className="w-16 h-16 md:w-24 md:h-24 text-primary" />
              </div>
              <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.4em] mb-2 md:mb-4">{offer.title}</p>
              <h3 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-2 md:mb-4 font-cinzel">{offer.val}</h3>
              <p className="text-[12px] md:text-sm text-white/40 mb-6 md:mb-8 font-medium font-poppins">{offer.desc}</p>
              <button 
                onClick={() => handleGetId()}
                className="inline-flex items-center gap-3 md:gap-4 bg-primary text-black px-6 md:px-8 py-2.5 md:py-3 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all outline-none"
              >
                 Activate <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
           </motion.div>
         ))}
      </section>

      {/* 5. EXCHANGE PANELS SECTION (DEMO IDs) */}
      <section className="container mx-auto px-4 md:px-8 relative py-8 md:py-10">
         <div className="absolute inset-x-0 md:inset-0 bg-primary/2 rounded-3xl md:rounded-[4rem] -z-10 border border-white/5" />
         <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 mb-8 md:mb-12 px-4">
            <div className="space-y-4 md:space-y-6 text-center lg:text-left flex-1">
               <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white italic tracking-tighter font-cinzel leading-tight uppercase">Instant <span className="text-gradient-primary">Payouts</span></h2>
               <p className="text-white/40 max-w-xl text-[12px] md:text-base font-light leading-relaxed font-poppins">Official Indian exchange infrastructure. Access high-limit liquidity with the speed of light.</p>
            </div>
            <div className="flex items-center gap-4 md:gap-8 bg-white/5 p-4 md:p-8 rounded-2xl md:rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl w-full sm:w-auto justify-center">
                <div className="text-center space-y-1">
                   <p className="text-2xl md:text-4xl font-black text-primary tracking-tighter italic font-cinzel">200K+</p>
                   <p className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em]">IDs</p>
                </div>
                <div className="w-px h-10 md:h-12 bg-white/10" />
                <div className="text-center space-y-1">
                   <p className="text-2xl md:text-4xl font-black text-primary tracking-tighter italic font-cinzel">100%</p>
                   <p className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em]">Record</p>
                </div>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 max-w-6xl mx-auto">
            {EXCHANGES.map((ex, i) => (
               <motion.div 
                 key={i} 
                 whileHover={{ y: -10 }}
                 className="group relative flex flex-col items-center text-center p-6 md:p-8 glass rounded-2xl md:rounded-[3rem] transition-all shadow-2xl overflow-hidden"
               >
                  <div className="absolute -top-20 -right-20 w-32 md:w-64 h-32 md:h-64 bg-primary/10 blur-[60px] md:blur-[100px] rounded-full" />
                  {ex.badge && (
                    <div className="absolute top-4 right-4 z-10 font-bold bg-linear-to-r from-red-600 to-red-500 text-white px-3 py-1 text-[8px] md:text-[9px] uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-400/50 animate-pulse">
                      {ex.badge}
                    </div>
                  )}
                  <div className="relative w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-6 rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 flex items-center justify-center transition-all duration-700">
                     <Image src={ex.logo} alt={ex.name} width={48} height={48} className="object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-white mb-2 md:mb-4 uppercase tracking-tighter italic font-cinzel">{ex.name}</h3>
                  <p className="text-[12px] md:text-sm text-white/40 mb-6 md:mb-8 font-medium leading-relaxed max-w-xs font-poppins">{ex.desc}</p>
                  <Link href={ex.link} target="_blank" className="w-full py-4 md:py-5 bg-white/5 hover:bg-primary hover:text-black border border-white/10 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] transition-all">
                     View Demo
                  </Link>
               </motion.div>
            ))}
         </div>
      </section>

      {/* 7. LIVE ACTIVITY FEED (TICKER) */}
      <section className="bg-primary/5 border-y border-white/5 py-6 md:py-10 relative overflow-hidden backdrop-blur-md">
        <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-linear-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-linear-to-l from-background to-transparent z-10" />
        <div className="flex items-center gap-8 md:gap-16 animate-marquee whitespace-nowrap">
           {tickers.map((t, i) => (
             <div key={i} className="flex items-center gap-3 md:gap-5 px-6 md:px-10 py-3 md:py-4 glass border-white/10 rounded-full shrink-0">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.15em] md:tracking-[0.2em] font-poppins">{t}</span>
             </div>
           ))}
           {tickers.map((t, i) => (
             <div key={i+"dup"} className="flex items-center gap-3 md:gap-5 px-6 md:px-10 py-3 md:py-4 glass border-white/10 rounded-full shrink-0">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.15em] md:tracking-[0.2em] font-poppins">{t}</span>
             </div>
           ))}
        </div>
      </section>


      {/* 3. LIVE SPORTS DASHBOARD */}
      <section className="container mx-auto px-4 md:px-8 py-10 md:py-20 space-y-8 md:space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
           <div className="space-y-4 md:space-y-6">
              <h2 className="text-3xl md:text-6xl font-black text-white italic tracking-tighter font-cinzel uppercase leading-none">GLOBAL <span className="text-gradient-primary">ARENA</span></h2>
              <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]" />
                  <p className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.3em] md:tracking-[0.5em]">
                    Live {lastSynced ? `• ${lastSynced.toLocaleTimeString()}` : ''} 
                    <span className="ml-2 text-primary">{nextSyncIn}s</span>
                  </p>
              </div>
           </div>
           
           <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/5 backdrop-blur-xl shrink-0">
              {['all', 'cricket', 'soccer', 'tennis'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSport(s)}
                  className={cn(
                    "px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                    selectedSport === s 
                      ? "bg-primary text-black" 
                      : "text-white/40 hover:text-white"
                  )}
                >
                  {s}
                </button>
              ))}
           </div>

           <Link href="/sports" className="group flex items-center gap-2 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] border-b border-primary/20 pb-1 hover:border-primary transition-all self-start lg:self-end">
              Board <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

        {(loadingMatches && liveMatches.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-24 md:py-40 space-y-6 glass rounded-4xl border-dashed">
              <Loader2 className="w-10 h-10 md:w-16 md:h-16 text-primary animate-spin" />
              <p className="text-[10px] md:text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Connecting Server...</p>
          </div>
        ) : liveMatches.filter(m => selectedSport === 'all' || m.sport === selectedSport).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-32 space-y-4 glass rounded-[2rem] md:rounded-[4rem] border border-white/5 bg-white/2">
             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white/20" />
             </div>
             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">No Live Events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {liveMatches
              .filter(m => selectedSport === 'all' || m.sport === selectedSport)
              .map((match) => (
              <motion.div 
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-white/2 border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 space-y-4 md:space-y-6 hover:bg-white/5 transition-all"
              >
                 <div className="flex justify-between items-center opacity-60">
                    <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-[0.2em] truncate mr-2">{match.league}</span>
                    <span className="text-[8px] md:text-[9px] font-bold text-primary flex items-center gap-1.5 shrink-0">
                      <span className="w-1 h-1 rounded-full bg-primary animate-pulse" /> {match.detail}
                    </span>
                 </div>

                 <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between">
                       <p className="text-base md:text-lg font-bold text-white/90 font-cinzel tracking-tight">{match.team1}</p>
                       <p className="text-xl md:text-2xl font-black text-primary italic">{match.score1}</p>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-base md:text-lg font-bold text-white/90 font-cinzel tracking-tight">{match.team2}</p>
                       <p className="text-xl md:text-2xl font-black text-primary italic">{match.score2}</p>
                    </div>
                 </div>

                 
                 <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                    {[1, 'X', 2].map(type => (
                       <div key={type} className="p-2 md:p-2 bg-white/5 rounded-lg text-center cursor-pointer hover:bg-primary border border-transparent hover:border-primary transition-all group/odd">
                          <p className="text-[7px] text-white/40 uppercase font-black group-hover/odd:text-black">{type}</p>
                          <p className="text-[10px] md:text-[11px] font-black text-primary group-hover/odd:text-black">{(1.5 + Math.random() * 2).toFixed(2)}</p>
                       </div>
                    ))}
                 </div>

                 <div className="pt-3 border-t border-white/5 flex gap-2">
                    <button 
                      onClick={() => handleGetId()}
                      className="flex-1 py-3 md:py-3 bg-primary text-black text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-xl text-center active:scale-95 transition-all shadow-lg"
                    >
                       Bet Now
                    </button>
                    <button 
                      onClick={() => handleGetId()}
                      className="px-4 py-3 bg-white/5 text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-xl text-center"
                    >
                       Market
                    </button>
                 </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 4. POPULAR CASINO GAMES SHOWCASE */}
      <section className="container mx-auto px-4 md:px-8 py-10 md:py-20 overflow-hidden">
         <div className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-24 gap-6 md:gap-10">
            <div className="space-y-4 md:space-y-6 text-center md:text-left">
               <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter font-cinzel uppercase leading-none text-center">GRAND <span className="text-gradient-gold">CASINO</span></h2>
               <p className="text-[9px] md:text-[11px] font-black text-accent uppercase tracking-[0.5em] md:tracking-[1em]">Royal Gaming Arena</p>
            </div>
            <div className="h-px flex-1 bg-linear-to-r from-accent/30 to-transparent hidden md:block mx-12" />
         </div>

         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
            {CASINO_GAMES.map((game, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[300px] md:h-[450px] rounded-3xl md:rounded-[3rem] overflow-hidden border border-white/10 cursor-pointer shadow-2xl"
              >
                 <Image src={game.image} alt={game.name} fill className="object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
                 <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80" />
                 <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    <span className="text-[7px] md:text-[9px] font-black text-accent bg-accent/10 border border-accent/20 px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg uppercase tracking-[0.1em] md:tracking-[0.2em] backdrop-blur-md">{game.type}</span>
                 </div>
                 <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 space-y-4 md:space-y-6">
                    <h3 className="text-lg md:text-3xl font-black text-white italic leading-none font-cinzel">{game.name.toUpperCase()}</h3>
                    <button 
                      onClick={() => handleGetId()}
                      className="block w-full text-center glass-gold hover:bg-accent hover:text-black py-3 md:py-5 rounded-lg text-[8px] md:text-[10px] font-black text-white uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all"
                    >
                       Play Now
                    </button>
                 </div>
              </motion.div>
            ))}
         </div>
      </section>


      {/* 6. VIP CLUB SECTION */}
      <section className="container mx-auto px-4 md:px-8 py-10 md:py-20">
         <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter font-cinzel uppercase">VIP <span className="text-gradient-gold">CLUB</span></h2>
            <p className="text-[9px] md:text-[11px] font-black text-accent uppercase tracking-[0.4em] md:tracking-[0.8em]">Reserved for the distinguished elite</p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {VIP_LEVELS.map((vip, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={cn(
                  "relative rounded-2xl md:rounded-3xl p-px overflow-hidden shadow-2xl transition-all",
                  vip.level === "Gold" && "scale-[1.02] sm:scale-105 z-20 border-accent/30",
                  vip.level === "Platinum" && "shadow-primary/10"
                )}
              >
                 <div className={cn("absolute inset-0 bg-linear-to-br opacity-20", vip.color)} />
                 <div className="relative h-full bg-background/90 backdrop-blur-3xl rounded-[1.4rem] md:rounded-[2.4rem] p-5 md:p-6 flex flex-col items-center border border-white/5">
                    <p className={cn("text-lg md:text-xl font-black italic tracking-tighter mb-3 md:mb-4 bg-linear-to-r bg-clip-text text-transparent uppercase font-cinzel text-center", vip.color)}>{vip.level}</p>
                    <div className="w-full space-y-2 mb-6">
                       {vip.perks.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-2 group/perk">
                             <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-1.5 h-1.5 md:w-2 md:h-2 text-primary" />
                             </div>
                             <span className="text-[10px] md:text-[10px] font-bold text-white/50 font-poppins">{p}</span>
                          </div>
                       ))}
                    </div>
                     <button 
                       onClick={() => handleGetId()}
                       className="mt-auto w-full py-2.5 md:py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white transition-all text-center"
                     >
                        Upgrade Access
                     </button>
                 </div>
              </motion.div>
            ))}
         </div>
      </section>

      {/* 8.5 SEO AND FAQ SECTION */}
      <section className="container mx-auto px-4 md:px-8 py-10 md:py-20">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-6 md:space-y-8">
               <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase font-cinzel leading-none"><span className="text-primary text-xl md:text-2xl block not-italic mb-2 tracking-[0.2em]">ELITE STATUS</span>THE #1 BETTING <br/>DYNASTY IN INDIA</h2>
                  <div className="h-1 w-20 bg-primary" />
               </div>
               <div className="space-y-6 text-white/40 leading-relaxed font-poppins text-sm md:text-base">
                  <p>
                    JSR Sports stands as the definitive authority for online betting IDs, trusted by over 200,000 professional players across India. We provide exclusive white-label access to major exchanges like All Panel, Go Exchange, 11xSports, and Lotus, ensuring that every member experiences the pinnacle of secure gambling.
                  </p>
                  <p>
                    Our infrastructure is purpose-built for the Indian market, featuring 2-minute UPI deposit/withdrawal loops and 24/7 dedicated account managers available via WhatsApp. Whether you are looking for high-limit cricket betting or the thrill of live royal casino games, JSR Sports is your gateway to an elite gaming experience.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-4">
                     {TRUST_BADGES.map((b, i) => (
                       <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                          <b.icon className="w-4 h-4 text-primary" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{b.label}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase font-cinzel">Operational FAQ</h3>
               <div className="space-y-4">
                  {[
                    { q: "How quickly can I get an All Panel or 11xSports ID?", a: "Activation is instantaneous. Once you connect with our WhatsApp support, your ID is delivered within 60 seconds." },
                    { q: "What is the minimum deposit amount?", a: "To maintain our elite service standards, the minimum deposit is ₹500, enabling full access to all live arenas." },
                    { q: "Is withdrawal really instant?", a: "Yes. Our automated UPI systems process withdrawals in under 2 minutes, 24 hours a day, including weekends." },
                    { q: "Are my winnings safe with JSR Sports?", a: "Absolutely. With 12 years of operational excellence and a zero-default payout record, we are the most secure portal in the industry." }
                  ].map((faq, i) => (
                    <div key={i} className="bg-white/2 border border-white/5 p-5 md:p-6 rounded-2xl hover:bg-white/5 transition-all group">
                       <h4 className="text-[12px] md:text-sm font-black text-white uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">{faq.q}</h4>
                       <p className="text-[11px] md:text-sm text-white/30 font-medium leading-relaxed font-poppins">{faq.a}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
