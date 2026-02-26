"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Info, Send, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function NotifyMeModal({ isOpen, onClose, episodeNumber }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        message: `I want to be notified when Episode ${episodeNumber} drops!`,
      }));
      setIsSuccess(false);
      setError("");
    }
  }, [isOpen, episodeNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("ALL FIELDS REQUIRED");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/secret-drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: `Episode ${episodeNumber} Notification`,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setError("SUCCESS! ACCESS GRANTED");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else if (response.status === 409) {
        setError("YOU ALREADY SUBMITTED");
        setFormData({ name: "", email: "", message: "" }); // Clear inputs on duplicate too
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "STAY VIGILANT! ACCESS GRANTED");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError("CONNECTION ERROR");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  const content = (
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
            className="relative w-full max-w-xl bg-zinc-950 border border-primary/30 rounded-3xl p-8 md:p-12 shadow-[0_0_100px_rgba(212,255,0,0.1)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-primary transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-primary/60 mb-2">
                  <Info size={14} className="animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-subheading">Upcoming Transmission</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white">
                  NOTIFY ME: EPISODE {episodeNumber}
                </h2>
              </div>

              {isSuccess ? (
                <div className="py-12 text-center space-y-4 w-full">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
                    Access Granted
                  </h4>
                  <p className="text-white/60 text-sm tracking-wide">
                    You will be notified as soon as the transmission is live.
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-6">
                  <div className="h-px w-full bg-white/10" />

                  <p className="text-sm md:text-base text-white/60 tracking-wide">
                    Join the Inner Circle to receive alerts for this episode
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
                      />
                      <input
                        required
                        type="email"
                        placeholder="john.doe@example.cc"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-sm text-white outline-none focus:border-primary/50 transition-colors resize-none"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-black font-subheading font-bold py-3 px-6 rounded-lg text-xs tracking-tighter hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? "PROCESSING..." : "SECRET DROPS!"}
                    </button>
                  </form>
                </div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs font-mono tracking-widest ${
                    error.includes("SUCCESS") || error.includes("GRANTED") ? "text-primary" : "text-red-500"
                  }`}
                >
                  {error}
                </motion.p>
              )}

              <div className="flex items-center gap-3 text-white/20">
                <ShieldCheck size={14} />
                <span className="text-[10px] uppercase tracking-[0.2em]">End-to-End Encryption Active</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
