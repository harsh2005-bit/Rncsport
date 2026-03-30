"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Menu, 
  X, 
  Home,
  Trophy,
  Gift,
  Headset,
  User as UserIcon,
  LogOut,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Wallet,
  ArrowUpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout, openAuthModal, notifications, markNotificationAsRead } = useAuth();
  
  // Debug NAVBAR STATE
  useEffect(() => {
    console.log("NAVBAR NOTIFICATIONS STATE:", notifications);
  }, [notifications]);

  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Arena", icon: Home, href: "/" },
    { name: "Sports", icon: Trophy, href: "/sports" },
    { name: "Casino", icon: Gift, href: "/casino" },
    { name: "Support", icon: Headset, href: "/support" }
  ];

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 h-20 flex items-center transition-all duration-500",
      isScrolled ? "bg-black/95 backdrop-blur-md border-b border-white/10 shadow-2xl" : "bg-transparent"
    )} style={{ zIndex: 10000 }}>
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 lg:gap-8">
          <Link href="/" className="group flex items-center gap-2 text-2xl font-black tracking-tighter text-white font-cinzel">
            <div className="relative w-16 sm:w-28 md:w-32 h-10 md:h-14 group-hover:scale-105 transition-all">
              <Image 
                src="/logo.jpg" 
                alt="JSR SPORTS" 
                fill 
                className="object-contain mix-blend-screen"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-[11px] font-black uppercase tracking-[0.25em] text-white/40 hover:text-primary transition-all hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:flex relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search..."
              className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-xs w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
            />
          </div>

          {/* Quick Action Buttons (Mobile + Desktop) */}
          <div className="flex items-center gap-2">
            <Link
              href="/get-id"
              className="flex items-center gap-1.5 px-3 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-linear-to-r from-primary to-secondary text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-[0.2em] shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              <Wallet size={12} className="md:hidden" />
              <span className="hidden sm:inline">Submit Payment</span>
              <span className="sm:hidden">Deposit</span>
            </Link>
            
            <Link
              href="/withdraw"
              className="flex items-center gap-1.5 px-3 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-[0.2em] hover:bg-white/10 hover:border-primary/40 transition-all whitespace-nowrap"
            >
              <ArrowUpCircle size={12} className="md:hidden" />
              <span className="hidden sm:inline">Withdraw Funds</span>
              <span className="sm:hidden">Withdraw</span>
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              {/* Notifications */}
              <div className="relative z-10001 flex items-center" ref={notificationsRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-primary hover:bg-white/10 transition-all relative group cursor-pointer"
                >
                  <Bell size={18} className="sm:w-5 sm:h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[14px] sm:min-w-[16px] h-3.5 sm:h-4 bg-primary text-black text-[8px] sm:text-[9px] font-black rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)] border border-black flex items-center justify-center px-1">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="fixed sm:absolute inset-x-4 sm:inset-x-auto sm:right-0 top-24 sm:top-[130%] w-auto sm:w-80 rounded-2xl bg-[#0b0b0b] backdrop-blur-md shadow-2xl p-5 flex flex-col gap-4 border border-white/10 overflow-hidden"
                      style={{ transformOrigin: "top right", zIndex: 10002 }}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Recent Activity</span>
                        <div className="px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                           <span className="text-[9px] font-bold text-primary">{notifications.length}</span>
                        </div>
                      </div>

                      <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="py-12 flex flex-col items-center gap-3 opacity-20 text-white">
                            <Bell size={40} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-center">No new activity</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id}
                              onClick={() => {
                                if (!notif.read) markNotificationAsRead(notif.id);
                                setIsNotificationsOpen(false);
                                router.push((notif.type === 'withdraw' || notif.type === 'withdrawal') ? '/withdraw' : '/payment');
                              }}
                              className={cn(
                                "p-3 rounded-xl border transition-colors flex flex-col gap-3 group/item cursor-pointer",
                                !notif.read ? "bg-white/10 border-white/20 hover:bg-white/15" : "bg-white/5 border-white/5 hover:bg-white/10"
                              )}
                            >
                              <div className="flex gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                                  notif.title.includes('Approved') ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                  notif.title.includes('Rejected') ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                  "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                )}>
                                  {notif.title.includes('Approved') ? <CheckCircle2 size={18} /> : 
                                   notif.title.includes('Rejected') ? <XCircle size={18} /> : 
                                   <Clock size={18} />}
                                </div>
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-white truncate">
                                      {notif.title}
                                    </span>
                                  </div>
                                  <p className="text-[9px] text-white/40 leading-relaxed">
                                    {notif.message}
                                  </p>
                                </div>
                              </div>

                              {/* Credentials Block for Payment Type */}
                              {notif.credentials && (
                                <div className="mt-1 p-3 rounded-lg bg-white/5 border border-white/5 space-y-2">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">ID</span>
                                      <span className="text-[10px] font-bold text-primary tabular-nums">{notif.credentials.id}</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Pass</span>
                                      <span className="text-[10px] font-bold text-primary tabular-nums">{notif.credentials.password}</span>
                                    </div>
                                  </div>
                                  <a 
                                    href={notif.credentials.link.startsWith('http') ? notif.credentials.link : `https://${notif.credentials.link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!notif.read) markNotificationAsRead(notif.id);
                                    }}
                                    className="w-full py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary text-[9px] font-black uppercase tracking-widest text-center transition-all block"
                                  >
                                    Open Betting Panel
                                  </a>
                                </div>
                              )}
                            </div>

                          ))
                        )}
                      </div>

                      <button 
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          router.push('/payment');
                        }}
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all text-center"
                      >
                        View History
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative z-10001 ml-1" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group cursor-pointer"
                >
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                    <Image 
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email || 'User'}&background=fbbf24&color=000&bold=true`}
                      alt="Profile" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 top-[130%] w-60 rounded-2xl glass border border-white/10 shadow-2xl p-2 z-10002"
                      style={{ transformOrigin: "top right" }}
                    >
                      <div className="px-4 py-3 border-b border-white/10 mb-2 rounded-xl bg-white/5 backdrop-blur-sm">
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Authenticated Elite</p>
                        <p className="text-sm font-black text-white truncate">
                          {user?.displayName || user?.email?.split('@')[0] || "Elite Member"}
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          router.push('/profile');
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 group"
                      >
                        <UserIcon size={16} className="text-white/20 group-hover:text-primary transition-colors" /> My Profile
                      </button>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-3 mt-1"
                      >
                        <LogOut size={16} /> Logout System
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 shadow-lg"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2.5 bg-white/5 border border-white/10 rounded-xl text-primary hover:bg-white/10 transition-all active:scale-90 shadow-lg"
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-10003"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-background border-l border-white/10 z-10004 flex flex-col overflow-hidden"
            >
              <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Navigation</span>
                  <span className="text-xs font-bold text-white/20">JSR Neural Command</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {user && (
                <div className="px-8 py-6 border-b border-white/5 bg-white/2">
                   <div className="flex items-center gap-4">
                     <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-primary/20 bg-primary/5">
                        <Image 
                          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=fbbf24&color=000&bold=true`}
                          alt="User"
                          fill
                          className="object-cover"
                        />
                     </div>
                     <div className="flex flex-col leading-none py-1">
                        <span className="text-sm font-black text-white uppercase tracking-tight">
                           {user?.displayName || user?.email?.split('@')[0] || "Elite Member"}
                        </span>
                     </div>
                   </div>
                </div>
              )}

              <div className="p-8 flex flex-col gap-4 overflow-y-auto flex-1 custom-scrollbar">
                {navLinks.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 text-lg font-black text-white hover:bg-white/10 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                        <item.icon className="w-5 h-5 group-hover:text-primary" />
                      </div>
                      <span className="tracking-tighter italic">{item.name}</span>
                    </div>
                    <ChevronRight size={18} className="text-white/20 group-hover:text-primary transition-all" />
                  </Link>
                ))}
              </div>

              <div className="p-8 bg-black/40 border-t border-white/5 space-y-4">
                  <Link
                    href="/get-id"
                    onClick={() => setIsOpen(false)}
                    className="w-full block px-6 py-4 rounded-2xl bg-linear-to-r from-primary to-secondary text-black text-center text-xs font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                  >
                    Submit Proof
                  </Link>
                  {user && (
                    <button 
                      onClick={handleLogout}
                      className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-black uppercase tracking-widest text-red-500/60 flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
