"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function WhatsAppButton() {
  const WHATSAPP_LINK = "https://wa.me/447735378047?text=" + encodeURIComponent("Hello JSR SPORTS support, I need assistance with my betting ID.");

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-100">
      <Link href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(251, 191, 36, 0.2)",
              "0 0 40px rgba(251, 191, 36, 0.6)",
              "0 0 20px rgba(251, 191, 36, 0.2)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-primary text-black p-4 md:p-5 rounded-3xl shadow-2xl flex items-center justify-center relative border border-primary/30 group"
        >
          <div className="absolute inset-0 bg-primary rounded-3xl animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <motion.div
             animate={{ rotate: [0, -10, 10, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity }}
          >
            <MessageCircle className="w-6 h-6 md:w-8 md:h-8 relative z-10 fill-current" />
          </motion.div>
        </motion.div>
      </Link>
    </div>
  );
}
