"use client";

import { MessageCircle, Zap, Lock, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
       <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Customer Support</h1>
          <p className="text-muted-foreground font-medium text-lg">We are here to help you 24/7</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hindi / English Message Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary/30 border border-border rounded-3xl p-8 relative overflow-hidden"
          >
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
             <div className="relative z-10 space-y-6 text-lg font-medium">
                <p>नमस्ते 👋</p>
                <p>From <strong>JSR Sports</strong></p>
                <p>हम Online Platform Access & Digital IDs प्रोवाइड करते हैं।</p>
                <p>सर्विस लेने के लिए या अधिक जानकारी के लिए 👇</p>
                
                <div className="bg-background/80 p-4 rounded-xl border border-border">
                   <p className="font-bold mb-2 text-sm uppercase tracking-wider">📌 WhatsApp Call / Message करें:</p>
                    <a href="https://wa.me/447735378047" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-2xl font-black text-[#25D366] hover:underline hover:brightness-110 transition-all">
                     <MessageCircle className="w-8 h-8" /> +44 7735378047
                   </a>
                   <a href="https://wa.me/447474793397" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-2xl font-black text-[#25D366] hover:underline hover:brightness-110 transition-all">
                     <MessageCircle className="w-8 h-8" /> +44 7474793397
                   </a>
                   <a href="https://wa.me/447735316528" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-2xl font-black text-[#25D366] hover:underline hover:brightness-110 transition-all">
                     <MessageCircle className="w-8 h-8" /> +44 7735316528
                   </a>
                   <a href="https://wa.me/918409186609" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-2xl font-black text-[#25D366] hover:underline hover:brightness-110 transition-all">
                     <MessageCircle className="w-8 h-8" /> +91 8409186609
                   </a>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                   <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">✓</div> Quick Activation</div>
                   <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">✓</div> Secure Access</div>
                   <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">✓</div> Easy Process</div>
                   <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">✓</div> 24×7 Support</div>
                </div>

                <p className="pt-4 border-t border-border/50 font-bold text-primary">हमारी टीम आपकी सहायता के लिए हमेशा उपलब्ध है।</p>
             </div>
          </motion.div>

          {/* Contact Features */}
          <div className="space-y-6 lg:mt-6">
             <div className="bg-secondary/20 p-6 rounded-3xl border border-border flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <HeadphonesIcon className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-bold mb-1">24/7 Availability</h3>
                   <p className="text-muted-foreground text-sm">Our support team operates round the clock to resolve your queries instantly via WhatsApp.</p>
                </div>
             </div>
             
             <div className="bg-secondary/20 p-6 rounded-3xl border border-border flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Zap className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-bold mb-1">Instant Activation</h3>
                   <p className="text-muted-foreground text-sm">Get your new ID activated and ready to use within minutes of contacting us.</p>
                </div>
             </div>

             <div className="bg-secondary/20 p-6 rounded-3xl border border-border flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Lock className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-bold mb-1">Privacy Assured</h3>
                   <p className="text-muted-foreground text-sm">All communications and details are kept strictly confidential and secure.</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
