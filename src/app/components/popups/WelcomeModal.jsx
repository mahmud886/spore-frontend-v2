"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import WelcomeHeroSection from "../home/WelcomeHeroSection";

export default function WelcomeModal({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl h-auto max-h-[95vh] md:max-h-[90vh] bg-zinc-950 border border-primary/30 md:rounded-3xl shadow-[0_0_100px_rgba(212,255,0,0.1)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Vault 7 Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-50" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-primary transition-colors z-[120] bg-black/40 p-2 rounded-full backdrop-blur-sm border border-white/10"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* Scrollable Container for HeroSection */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              <div className="min-h-full">
                <div className="relative">
                  <WelcomeHeroSection />
                  {/* Overlay to blend HeroSection with Vault 7 dark theme */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                </div>

                {/* Additional Info for new visitors (Vault 7 style) */}
                <div className="bg-zinc-950 py-10 px-6 text-center border-t border-primary/10 relative">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="space-y-3">
                      <h3 className="text-xl md:text-2xl font-display font-bold text-primary uppercase tracking-widest">
                        Welcome to the Resistance
                      </h3>
                      <p className="text-white/70 text-base leading-relaxed font-subheading">
                        You have been redirected here from the mainnet to see the impact of your choices. SPORE FALL is
                        an immersive sci-fi experience where the community shapes the narrative.
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <Link
                        href="/"
                        className="group relative px-10 py-3 bg-primary text-black hover:bg-primary/90 transition-all duration-300 font-bold uppercase tracking-widest rounded-tr-xl rounded-bl-xl overflow-hidden active:scale-95"
                      >
                        <span className="relative z-10 text-sm">Continue to Homepage</span>
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                      </Link>

                      <div className="flex items-center gap-3 text-white/20">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] uppercase tracking-[0.2em]">End-to-End Encryption Active</span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative border at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
