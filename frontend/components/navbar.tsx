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
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, openAuthModal } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
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

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 h-20 z-50 flex items-center transition-all duration-500",
      isScrolled ? "bg-background/80 backdrop-blur-3xl border-b border-white/5" : "bg-transparent"
    )}>
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="group flex items-center gap-4 text-2xl font-black tracking-tighter text-white font-cinzel">
            <div className="relative w-28 md:w-32 h-12 md:h-14 group-hover:scale-105 transition-all">
              <Image 
                src="/logo.jpg" 
                alt="JSR SPORTS" 
                fill 
                className="object-contain mix-blend-screen"
              />
            </div>
            {user && (
              <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-primary/20 bg-primary/5">
                  <Image 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=000&color=fbbf24&bold=true`}
                    alt="User"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[8px] font-black text-white/60 uppercase tracking-widest hidden md:block">
                  Verified Elite
                </span>
              </div>
            )}
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search Ecosystem..."
              className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
            />
          </div>
          
          <div className="hidden sm:flex items-center gap-3">
             <Link
                href="/payment"
                className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#fbbf24] to-[#f59e0b] text-black text-[10px] font-black uppercase tracking-[0.25em] shadow-[0_0_15px_rgba(251,191,36,0.35)] hover:scale-105 active:scale-95 transition-all text-center"
              >
                Submit Payment
              </Link>

              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-white/10" ref={dropdownRef}>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">
                      {user.displayName || user.email?.split('@')[0] || "Elite Member"}
                    </span>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="relative w-10 h-10 rounded-xl overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all cursor-pointer"
                    >
                      {user.photoURL ? (
                        <Image 
                          src={user.photoURL} 
                          alt="Profile" 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <Image 
                          src={`https://ui-avatars.com/api/?name=${user.displayName || user.email || 'User'}&background=fbbf24&color=000&bold=true`}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-[120%] w-56 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-2 z-50 flex flex-col gap-1 border"
                          style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", transformOrigin: "top right" }}
                        >
                          <div className="px-4 py-3 border-b mb-1 rounded-xl" style={{ backgroundColor: "#f8fafc", borderColor: "#f1f5f9" }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#059669" }}>Signed In As</p>
                            <p className="text-sm font-bold truncate my-1" style={{ color: "#0f172a" }}>
                              {user.displayName || user.email?.split('@')[0] || "Elite User"}
                            </p>
                            <p className="text-[10px] truncate font-medium" style={{ color: "#64748b" }}>{user.email}</p>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setIsProfileOpen(false);
                              router.push('/profile');
                            }}
                            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3"
                            style={{ color: "#334155" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            <UserIcon size={16} /> My Profile
                          </button>
                          
                          <button 
                            onClick={() => {
                              setIsProfileOpen(false);
                              logout();
                            }}
                            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 mt-1"
                            style={{ color: "#f43f5e" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fff1f2")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white/10 transition-all active:scale-95"
                >
                  Login
                </button>
              )}
          </div>

          <button 
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-xl text-primary hover:bg-white/10 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-60"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-background border-l border-white/10 z-70 p-8 flex flex-col gap-12"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary uppercase tracking-[0.5em]">Menu</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-lg font-black text-white italic tracking-tighter hover:text-primary transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-all">
                      <item.icon className="w-5 h-5" />
                    </div>
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto space-y-4">
                  <Link
                    href="/payment"
                    onClick={() => setIsOpen(false)}
                    className="w-full block px-6 py-4 rounded-xl bg-linear-to-r from-[#fbbf24] to-[#f59e0b] text-black text-[10px] font-black uppercase tracking-[0.25em] text-center shadow-[0_0_15px_rgba(251,191,36,0.35)]"
                  >
                    Submit Payment
                  </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
