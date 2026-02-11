"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function NotificationPopup({ isOpen, onClose, message, title = "Notice", type = "info" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-primary" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case "error":
        return <X className="w-6 h-6 text-red-500" />;
      default:
        return <Info className="w-6 h-6 text-primary" />;
    }
  };

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
          {/* Backdrop blur - only visible when modal is open */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-auto"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20, rotateX: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-md pointer-events-auto"
          >
            <div className="relative overflow-hidden bg-zinc-950/90 backdrop-blur-2xl border border-primary/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(212,255,0,0.15)] group">
              {/* Top accent line with progress animation */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear" }}
                className="absolute top-0 left-0 h-[3px] bg-primary shadow-[0_0_15px_#C2FF02]"
              />

              {/* Decorative corner elements */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[2px] h-full bg-primary/20" />
                <div className="absolute top-0 right-0 w-full h-[2px] bg-primary/20" />
              </div>
              <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-[2px] h-full bg-primary/20" />
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary/20" />
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 transition-all duration-300 z-20 group/close"
                aria-label="Close"
              >
                <X className="w-5 h-5 group-hover/close:rotate-90 transition-transform duration-300" />
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Icon with glow */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-[20px] rounded-full scale-150 animate-pulse" />
                  <div className="relative w-16 h-16 rounded-2xl border border-primary/30 flex items-center justify-center bg-black/50 rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    <div className="-rotate-45 group-hover:rotate-0 transition-transform duration-500">{getIcon()}</div>
                  </div>
                </div>

                {/* Content */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h3 className="text-2xl font-subheading font-bold text-white mb-3 uppercase tracking-[0.2em]">
                    {title}
                  </h3>
                  <div className="h-[1px] w-12 bg-primary/40 mx-auto mb-4" />
                  <p className="text-white/70 font-body text-lg font-medium leading-relaxed max-w-[280px]">{message}</p>
                </motion.div>

                {/* Animated status text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-subheading uppercase tracking-[0.2em] text-primary/80">
                    System Protocol Active
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
