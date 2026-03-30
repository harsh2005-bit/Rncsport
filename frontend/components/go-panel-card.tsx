"use client";

import { ChevronsUp, ChevronsDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function GoPanelCard() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center py-6 sm:py-8 w-full relative z-20 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-center relative sm:scale-[1.1] md:scale-[1.2] gap-6 sm:gap-0 mt-4 sm:mt-0">
        
        {/* Left Deposit Button */}
        <motion.div 
          onClick={() => router.push("/get-id")}
          whileHover={{ scale: 1.05 }}
          className="order-1 sm:order-0 group cursor-pointer relative z-10 flex flex-col items-center justify-center w-64 sm:w-auto sm:-mr-4 bg-[#1a1a1a] border border-white/5 rounded-2xl sm:rounded-none sm:rounded-l-3xl py-6 sm:py-8 px-8 sm:pl-8 sm:pr-12 shadow-[0_0_15px_rgba(251,191,36,0)] hover:shadow-[0_0_25px_rgba(251,191,36,0.25)] hover:border-[#fbbf24]/40 hover:z-30 transition-all duration-300 pointer-events-auto"
        >
          <span className="text-white text-xs font-black tracking-[0.2em] uppercase mb-2 sm:mb-3">Deposit</span>
          <ChevronsUp className="text-white w-8 h-8 sm:w-10 sm:h-10 group-hover:text-[#fbbf24] transition-colors duration-300" strokeWidth={3} />
        </motion.div>

        {/* Center Wallet Card */}
        <div className="order-2 sm:order-0 relative z-20 bg-[#1e1e1e] w-40 h-40 sm:w-[200px] sm:h-[220px] rounded-3xl flex flex-col items-center justify-center py-4 sm:py-6 px-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/5">
          {/* Logo Mimic */}
          <div className="flex flex-col items-center gap-1 w-full px-2">
             <div className="text-3xl sm:text-[3.5rem] font-black text-white leading-none tracking-tighter flex items-center justify-center mb-1">
                JS<span className="text-white relative"><span className="absolute inset-0 border-b-2 sm:border-b-4 border-[#fbbf24] rounded-full mix-blend-screen opacity-60"></span>R</span>
             </div>
             <div className="flex items-center justify-center gap-2 w-full">
                <div className="h-0.5 w-[25%] bg-[#fbbf24]" />
                <span className="text-[8px] sm:text-[10px] font-black text-white tracking-[0.2em] uppercase shrink-0">Sports</span>
                <div className="h-0.5 w-[25%] bg-[#fbbf24]" />
             </div>
          </div>
        </div>

        {/* Right Withdraw Button */}
        <motion.div 
          onClick={() => router.push("/withdraw")}
          whileHover={{ scale: 1.05 }}
          className="order-3 sm:order-0 group cursor-pointer relative z-10 flex flex-col items-center justify-center w-64 sm:w-auto sm:-ml-4 bg-[#1a1a1a] border border-white/5 rounded-2xl sm:rounded-none sm:rounded-r-3xl py-6 sm:py-8 px-8 sm:pr-8 sm:pl-12 shadow-[0_0_15px_rgba(251,191,36,0)] hover:shadow-[0_0_25px_rgba(251,191,36,0.25)] hover:border-[#fbbf24]/40 hover:z-30 transition-all duration-300 pointer-events-auto"
        >
          <span className="text-white text-xs font-black tracking-[0.2em] uppercase mb-2 sm:mb-3">Withdraw</span>
          <ChevronsDown className="text-white w-8 h-8 sm:w-10 sm:h-10 group-hover:text-[#fbbf24] transition-colors duration-300" strokeWidth={3} />
        </motion.div>

      </div>
    </div>
  );
}
