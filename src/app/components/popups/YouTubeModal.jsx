"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function YouTubeModal({ isOpen, onClose, videoUrl, title = "Watch Episode" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    // Handle regular, embed, and shorts YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (!mounted || !videoId) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-zinc-950 border border-primary/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(212,255,0,0.1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />

            {/* Header */}
            <div className="relative flex items-center justify-between p-6 md:px-8 border-b border-white/10 bg-black/20">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary/60">
                  <Play size={14} className="animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-subheading">Secure Transmission</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-widest">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/40 hover:text-primary transition-colors duration-200"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* YouTube Video Container */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                title={title}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Footer / Status Bar */}
            <div className="relative p-4 md:px-8 bg-black/40 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/20">
                <ShieldCheck size={14} />
                <span className="text-[10px] uppercase tracking-[0.2em]">Encrypted Video Stream Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary/60">Live Feed</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
