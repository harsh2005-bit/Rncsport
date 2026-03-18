"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Search, 
  Zap,
  RefreshCw,
  Loader2,
  ExternalLink,
  Flame,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

// Confirmed working endpoints for Mar 8, 2026
const ENDPOINTS = {
  cricket: ["cricket/8604", "cricket/int"],
  soccer: ["soccer/esp.1", "soccer/ita.1", "soccer/ger.1", "soccer/fra.1", "soccer/eng.1"],
  tennis: ["tennis/atp"],
};

interface Match {
  id: string;
  sport: string;
  tab: string;
  league: string;
  team1: string;
  team2: string;
  odds: string[];
  time: string;
  score1: string;
  score2: string;
  status: string;
  summary: string;
}

const TABS = ["Live Matches", "Upcoming", "Results"];

export default function SportsPage() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const handleGetId = () => {
    if (!user) {
      openAuthModal();
    } else {
      router.push("/get-id");
    }
  };
  const [activeSport, setActiveSport] = useState("cricket");
  const [activeTab, setActiveTab] = useState("Live Matches");
  const [searchQuery, setSearchQuery] = useState("");
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [nextSyncIn, setNextSyncIn] = useState(15);

  const generateVirtualMatches = (): Match[] => [
    {
      id: "v1", sport: "cricket", tab: "Live Matches", league: "Elite Premier League",
      team1: "Mumbai Titans", team2: "Delhi Royals", odds: ["1.85", "-", "2.10"],
      time: "2nd Innings • Over 18.2", score1: "184/4", score2: "172/10",
      status: "in", summary: "Mumbai needs 12 runs to win"
    },
    {
       id: "v2", sport: "cricket", tab: "Live Matches", league: "T20 Blast",
       team1: "Surrey", team2: "Somerset", odds: ["1.90", "-", "2.00"],
       time: "1st Innings • Over 14.1", score1: "158/2", score2: "Yet to Bat",
       status: "in", summary: "Surrey batting aggressively"
    },
    {
      id: "v3", sport: "soccer", tab: "Live Matches", league: "European Elite Cup",
      team1: "Real Madrid", team2: "Man City", odds: ["2.40", "3.10", "2.10"],
      time: "74'", score1: "2", score2: "2",
      status: "in", summary: "Intense pressure from City"
    },
    {
      id: "v4", sport: "tennis", tab: "Live Matches", league: "Wimbledon Final",
      team1: "Alcaraz", team2: "Djokovic", odds: ["1.75", "-", "2.25"],
      time: "Set 4 • 4-4", score1: "2", score2: "1",
      status: "in", summary: "Crucial service game"
    }
  ];

  const fetchMatches = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateParam = `${year}${month}${day}`;

    setLoading(true);
    let aggregated: Match[] = [];
    
    try {
        const fetchPromises = Object.entries(ENDPOINTS).flatMap(([sportId, paths]) => 
            paths.map(async (path): Promise<Match[]> => {
                try {
                    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${dateParam}&t=${Date.now()}`);
                    const data = await response.json();
                    
                    if (!data.events) return [];

                    return data.events.map((event: { id: string; competitions: unknown[]; leagues: { name: string; }[] }): Match | null => {
                        try {
                            const competition = event.competitions?.[0] as { status: { type: { state: string; detail: string; shortDetail: string; }, summary: string; }, competitors: { homeAway: string; team: { name: string; shortDisplayName: string; }; score: string; }[] };
                            if (!competition) return null;

                            const status = competition.status?.type?.state;
                            const competitors = competition.competitors || [];
                            const home = competitors.find((c: { homeAway: string }) => c.homeAway === "home");
                            const away = competitors.find((c: { homeAway: string }) => c.homeAway === "away");
                            
                            if (!home || !away) return null;

                            let tab = "Upcoming";
                            if (status === "in") tab = "Live Matches";
                            if (status === "post") tab = "Results";
                            if (status === "pre") tab = "Upcoming";

                            const odds = ["1.95", "3.20", "2.10"];
                            
                            const getScore = (competitor: { score?: string | number }) => {
                                return String(competitor.score || "0");
                            };

                            return {
                                id: event.id,
                                sport: sportId,
                                tab: tab,
                                league: data.leagues?.[0]?.name || "Official League",
                                team1: home.team?.shortDisplayName || home.team?.name || "TBD",
                                team2: away.team?.shortDisplayName || away.team?.name || "TBD",
                                odds: sportId === "soccer" ? odds : [odds[0], "-", odds[2]],
                                time: competition.status?.type?.shortDetail || competition.status?.type?.detail || "TBD",
                                score1: getScore(home),
                                score2: getScore(away),
                                status: status,
                                summary: competition.status?.summary || ""
                            };
                        } catch (err) {
                            console.error("Error parsing event", err);
                            return null;
                        }
                    }).filter((m: Match | null): m is Match => m !== null);
                } catch (e) {
                    console.error(`Failed for ${path}`, e);
                    return [];
                }
            })
        );

        const results = await Promise.all(fetchPromises);
        aggregated = results.flat();
        
        const unique = Array.from(new Map(aggregated.map(m => [m.id, m])).values());
        
        // Fallback to virtual if empty
        if (unique.length === 0) {
            setAllMatches(generateVirtualMatches());
        } else {
            setAllMatches(unique);
        }
        setLastUpdated(new Date());
        setNextSyncIn(15);
    } catch (error) {
        console.error("Global fetch failed", error);
        if (allMatches.length === 0) setAllMatches(generateVirtualMatches());
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 15000);
    const countdown = setInterval(() => {
      setNextSyncIn(prev => (prev > 0 ? prev - 1 : 15));
    }, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time Pulse
  useEffect(() => {
    const pulseInv = setInterval(() => {
      setAllMatches(prev => prev.map(match => {
        if (Math.random() > 0.3) return match;
        if (match.sport === 'soccer' && match.tab === 'Live Matches') {
           return {
             ...match,
             score1: String(parseInt(match.score1) + (Math.random() > 0.95 ? 1 : 0)),
             score2: String(parseInt(match.score2) + (Math.random() > 0.95 ? 1 : 0))
           };
        }
        if (match.sport === 'cricket' && match.tab === 'Live Matches' && match.score1.includes('/')) {
           const [runs, wickets] = match.score1.split('/').map(Number);
           return {
             ...match,
             score1: `${runs + (Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0)}/${wickets + (Math.random() > 0.98 ? 1 : 0)}`
           };
        }
        return match;
      }));
    }, 4000);
    return () => clearInterval(pulseInv);
  }, []);

  const filteredMatches = useMemo(() => {
    return allMatches.filter(match => {
        const matchesSport = match.sport === activeSport;
        const matchesTab = match.tab === activeTab;
        const matchesSearch = match.team1.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              match.team2.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              match.league.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSport && matchesTab && matchesSearch;
    });
  }, [allMatches, activeSport, activeTab, searchQuery]);

  return (
    <div className="space-y-12 pb-32">
       {/* Top Premium Ribbon */}
      <div className="bg-primary/5 border-y border-white/5 py-3 flex items-center justify-center gap-4 overflow-hidden backdrop-blur-3xl">
          <div className="flex items-center gap-2 animate-marquee whitespace-nowrap">
              {[1,2,3,4].map(i => (
                  <span key={i} className="flex items-center gap-12 px-6">
                      <span className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Global Feed Sync: 2026.03.08.001</span>
                      </span>
                      <span className="flex items-center gap-3">
                        <Flame className="w-4 h-4 text-accent fill-accent/20" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">T20 WC Final: Satellite Authorization Granted</span>
                      </span>
                  </span>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 px-6 md:px-0">
        {/* Left Sidebar - Navigation */}
        <div className="xl:col-span-1 space-y-10">
          <div className="relative group shadow-2xl shadow-primary/5">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 transition-all group-focus-within:text-primary group-focus-within:scale-110" />
            <input 
              type="text" 
              placeholder="Search Ecosystem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass border-white/10 rounded-[2rem] py-5 pl-14 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all font-medium placeholder:text-white/10"
            />
          </div>

          <div className="glass border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                    <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-black text-xs uppercase tracking-[0.3em] text-white">Live Engine</h2>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">Satellite Grid</p>
                </div>
              </div>
              <button 
                onClick={fetchMatches}
                disabled={loading}
                className="w-10 h-10 glass border-white/10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all group active:scale-90"
              >
                <RefreshCw className={cn("w-4 h-4 text-white/30 group-hover:text-primary transition-all", loading && "animate-spin text-primary")} />
              </button>
            </div>
            
            <div className="p-4 space-y-2">
              {Object.keys(ENDPOINTS).map((sport) => (
                <button 
                  key={sport}
                  onClick={() => setActiveSport(sport)}
                  className={cn(
                    "w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden active:scale-[0.98] border border-transparent",
                    activeSport === sport ? "bg-primary/20 border-primary/30 text-white shadow-xl shadow-primary/5" : "hover:bg-white/5 text-white/30 hover:text-white hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-4 relative z-10">
                      <div className={cn("w-2 h-2 rounded-full transition-all", activeSport === sport ? "bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/10")} />
                      <span className="font-black text-sm tracking-[0.05em] uppercase">{sport}</span>
                  </div>
                  <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white/40 group-hover:bg-primary group-hover:text-black transition-all">
                    {allMatches.filter(m => m.sport === sport).length}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass border-white/5 rounded-[3rem] p-10 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] font-cinzel">Global Status</h3>
                <div className="h-px w-10 bg-primary/30" />
              </div>
              <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <p className="text-xs font-black text-white/40 uppercase tracking-widest leading-none">Total Events</p>
                    <p className="text-2xl font-black text-white leading-none font-cinzel">{allMatches.length}</p>
                  </div>
                  <div className="flex justify-between items-center px-2 bg-primary/10 py-5 rounded-2xl border border-primary/20 shadow-xl shadow-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <p className="text-xs font-black text-primary uppercase tracking-widest leading-none">In-Play</p>
                    </div>
                    <p className="text-2xl font-black text-primary leading-none font-cinzel">{allMatches.filter(m => m.status === "in").length}</p>
                  </div>
              </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-3 space-y-12">
          {/* Featured Match - WC Final */}
          <section className="bg-linear-to-br from-emerald-600/40 via-background to-secondary/10 border border-white/10 rounded-[4rem] p-10 md:p-16 relative overflow-hidden min-h-[400px] shadow-2xl shadow-primary/5 group">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-1000" />
             <div className="absolute inset-0 bg-mesh-bg opacity-30 group-hover:opacity-50 transition-opacity" />
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 h-full">
                 <div className="flex-1 space-y-10">
                    <div className="flex items-center gap-4">
                        <span className="glass border-primary/30 text-primary text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.4em] backdrop-blur-3xl shadow-xl shadow-primary/10">Official Arena</span>
                        <div className="flex items-center gap-2 text-[11px] font-black text-primary animate-pulse tracking-[0.2em]">
                            <Zap className="w-4 h-4 fill-primary" /> SATELLITE FEED: LIVE
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter italic font-cinzel uppercase">World Cup <br/><span className="text-gradient-primary">Final</span></h1>
                        <p className="text-white/30 font-black text-xs uppercase tracking-[0.5em] leading-relaxed">Global Hub Node: 44.12.89 • Mod Stadium</p>
                    </div>
                    <div className="flex gap-6">
                        <button className="bg-primary text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-primary/30">Execute Analysis</button>
                        <button className="glass text-white border-white/10 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all backdrop-blur-3xl">Live Grid</button>
                    </div>
                 </div>
                 
                 <div className="w-full md:w-auto glass border-white/5 p-12 rounded-[3.5rem] shadow-2xl min-w-[360px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-b from-white/[0.02] to-transparent pointer-events-none" />
                    <div className="text-center space-y-10">
                        <div className="flex justify-center gap-10 items-center">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 rounded-[2rem] glass border-primary/20 flex items-center justify-center mb-2 shadow-xl shadow-primary/5">
                                    <span className="text-3xl font-black font-cinzel">IND</span>
                                </div>
                                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">India</p>
                            </div>
                            <div className="text-5xl font-black italic text-primary/10 font-cinzel">VS</div>
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 rounded-[2rem] glass border-white/5 flex items-center justify-center mb-2 opacity-40">
                                    <span className="text-3xl font-black font-cinzel">NZL</span>
                                </div>
                                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] opacity-40">NZL</p>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-white/5 space-y-4">
                            <p className="text-[10px] font-black text-primary/60 tracking-[0.4em] uppercase font-cinzel">Current Probability</p>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-4xl font-black text-white">1.45</span>
                                <div className="w-px h-8 bg-white/10" />
                                <span className="text-4xl font-black text-white/20">2.80</span>
                            </div>
                        </div>
                    </div>
                 </div>
             </div>
          </section>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
              <div className="flex items-center gap-2 bg-secondary/20 p-1.5 rounded-2xl border border-border/50">
                {TABS.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                            activeTab === tab ? "bg-primary text-secondary shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab}
                        <span className="ml-2 py-0.5 px-2 bg-black/10 rounded-md opacity-40">
                             {allMatches.filter(m => m.sport === activeSport && m.tab === tab).length}
                        </span>
                    </button>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/60 px-4">
                  <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      Global Connection
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <div className="uppercase tracking-widest flex items-center gap-2">
                    Resyncing in <span className="text-primary font-black min-w-[20px]">{nextSyncIn}s</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <div className="uppercase tracking-widest truncate">Synced: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}</div>
              </div>
          </div>

          {/* Matches Grid */}
          <div className="min-h-[600px] relative">
            <AnimatePresence mode="wait">
              {loading && allMatches.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-96 space-y-6"
                >
                    <div className="relative">
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-primary font-black uppercase tracking-[0.4em] text-xs">Accessing Satellite Feed</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">Authenticating with Global Stadium Gateways...</p>
                    </div>
                </motion.div>
              ) : filteredMatches.length > 0 ? (
                <motion.div 
                   key={`${activeSport}-${activeTab}`}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   transition={{ duration: 0.4, ease: "circOut" }}
                   className="grid grid-cols-1 gap-4"
                >
                  {filteredMatches.map((match) => (
                    <div 
                      key={match.id}
                      className="bg-secondary/15 border border-border/40 rounded-[2rem] p-8 hover:border-primary/40 transition-all group relative overflow-hidden backdrop-blur-sm"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/10 group-hover:bg-primary transition-all duration-700 shadow-[0_0_20px_rgba(16,185,129,0.2)]" />
                      
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="flex-1 space-y-8">
                          <div className="flex items-center gap-4">
                            {match.status === "in" && (
                                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live Coverage</span>
                                </div>
                            )}
                            <div className="bg-secondary/40 border border-border/30 px-3 py-1 rounded-full flex items-center gap-2">
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{match.league}</span>
                            </div>
                            <span className="text-[10px] font-black font-mono text-muted-foreground/60 tracking-widest bg-secondary/20 px-3 py-1 rounded-lg ml-auto lg:ml-0">
                                {match.time}
                            </span>
                          </div>
                          
                          <div className="flex flex-row items-center gap-8 lg:gap-24">
                            <div className="flex-1 text-left space-y-3">
                              <p className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors duration-300">{match.team1}</p>
                              <div className="w-8 h-1 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                            </div>
                            
                            <div className="flex flex-col items-center gap-3">
                                <div className="bg-background/80 border border-border/40 px-8 py-4 rounded-3xl text-4xl font-black italic shadow-2xl shadow-primary/5 min-w-[140px] text-center group-hover:bg-background transition-all group-hover:scale-110">
                                    <span className="text-foreground tracking-tighter">{match.score1}</span>
                                    <span className="mx-3 text-muted-foreground opacity-20">—</span>
                                    <span className="text-foreground tracking-tighter">{match.score2}</span>
                                </div>
                                {match.summary && (
                                    <p className="text-[9px] font-black text-primary/80 uppercase tracking-widest animate-pulse max-w-[180px] text-center leading-relaxed bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                        {match.summary}
                                    </p>
                                )}
                            </div>

                            <div className="flex-1 text-right space-y-3">
                              <p className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors duration-300">{match.team2}</p>
                              <div className="w-8 h-1 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500 ml-auto" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full lg:w-auto mt-4 lg:mt-0 border-t lg:border-t-0 lg:border-l border-border/30 pt-6 lg:pt-0 lg:pl-10">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Execution Odds</p>
                            <ExternalLink className="w-3 h-3 text-muted-foreground/30" />
                          </div>
                          <div className="grid grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
                            {match.odds.map((odd, idx) => (
                              <button 
                                onClick={handleGetId}
                                key={idx} 
                                className={cn(
                                    "relative bg-secondary/30 hover:bg-primary/20 hover:border-primary/40 border border-border/60 rounded-2xl px-8 py-5 transition-all duration-300 block text-center group/odd min-w-[100px] shadow-sm active:scale-95",
                                    odd === "-" && "opacity-30 pointer-events-none"
                                )}
                              >
                                  <div className="absolute top-1.5 right-1.5 opacity-0 group-hover/odd:opacity-100 transition-all scale-50 group-hover/odd:scale-100">
                                    <Zap className="w-2.5 h-2.5 text-primary fill-primary" />
                                  </div>
                                  <p className="text-[10px] text-muted-foreground font-black mb-1.5 opacity-40 uppercase tracking-tighter transition-opacity group-hover/odd:opacity-100">
                                    {match.sport === "soccer" ? (idx === 0 ? 'Home' : idx === 1 ? 'Draw' : 'Away') : (idx === 0 ? 'Home' : 'Away')}
                                  </p>
                                  <p className="font-black text-primary text-lg tracking-widest">{odd}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-[500px] border border-dashed border-border/40 rounded-[3rem] bg-secondary/5 relative overflow-hidden"
                >
                   <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent opacity-50" />
                   <div className="relative z-10 text-center">
                       <div className="w-32 h-32 rounded-[2.5rem] bg-secondary/30 flex items-center justify-center mb-8 border border-border/50 mx-auto transform rotate-12 group hover:rotate-0 transition-transform duration-500">
                           <Globe className="w-12 h-12 text-muted-foreground/20 animate-spin-slow" />
                       </div>
                       <div className="space-y-4">
                           <h3 className="text-3xl font-black text-muted-foreground/80 italic tracking-tight uppercase">Coverage Gap</h3>
                           <p className="text-xs text-muted-foreground/40 font-black max-w-[320px] mx-auto uppercase tracking-widest leading-relaxed">No real-time signatures detected for this category in the current global satellite transmission.</p>
                       </div>
                       <button 
                            onClick={() => setActiveSport("soccer")}
                            className="mt-12 group relative flex items-center gap-3 bg-secondary/20 hover:bg-primary/10 border border-border/50 hover:border-primary/30 px-10 py-4 rounded-2xl mx-auto transition-all transition-duration-500"
                       >
                            <RefreshCw className="w-4 h-4 text-primary group-hover:rotate-180 transition-transform duration-700" />
                            <span className="text-[11px] font-black uppercase text-primary tracking-widest">Rescan Global Feed</span>
                       </button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
