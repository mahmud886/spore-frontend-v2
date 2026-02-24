"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function VaultLockPopup({ isOpen, onClose, onUnlock }) {
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "777777") {
      onUnlock();
    } else {
      setError("INVALID ACCESS CODE");
      setPassword(""); // Clear password on error
      setTimeout(() => setError(""), 2000);
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    setPassword(val);
    if (val === "777777") {
      onUnlock();
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("ALL FIELDS REQUIRED");
      return;
    }
    if (!STRICT_EMAIL_REGEX.test(formData.email)) {
      setError("INVALID EMAIL");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/secret-drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setError("SUCCESS! ACCESS GRANTED");
        setFormData({ name: "", email: "" });
        // Unlock and navigate after a brief delay to show success message
        setTimeout(() => {
          onUnlock();
        }, 1500);
      } else {
        // Even if submission fails (e.g. user already exists), grant access
        setError("STAY VIGILANT! ACCESS GRANTED");
        setFormData({ name: "", email: "" });
        setTimeout(() => {
          onUnlock();
        }, 1500);
      }
    } catch (err) {
      // Even on network error, grant access to ensure user is not stuck
      setError("STAY VIGILANT! ACCESS GRANTED");
      setTimeout(() => {
        onUnlock();
      }, 1500);
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
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-primary/60 mb-2">
                  <Lock size={14} className="animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-subheading">Security Protocol</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white">
                  ACCESS LIMITED TO CLEARANCE LEVEL 3
                </h2>
              </div>

              {/* Password Section */}
              <div className="w-full space-y-6">
                <div className="h-px w-full bg-white/10" />

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="flex flex-col items-center gap-4">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                      ENTER PASSWORD:
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={password}
                      onChange={handlePasswordChange}
                      autoFocus
                      placeholder="• • • • • •"
                      className="bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none text-center text-2xl tracking-[0.5em] w-48 pb-2 text-primary transition-colors font-mono placeholder:text-white/10"
                    />
                  </div>
                </form>

                <div className="h-px w-full bg-white/10" />
              </div>

              {/* Newsletter Section */}
              <div className="w-full space-y-6">
                <p className="text-sm md:text-base text-white/60 tracking-wide">
                  Join the Inner Circle to unlock Lionara’s Vault 7
                </p>

                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="john.doe@example.cc"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-black font-subheading font-bold py-3 px-6 rounded-lg text-xs tracking-tighter hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                  >
                    SECRET DROPS!
                  </button>
                </form>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs font-mono tracking-widest ${
                    error.includes("SUCCESS") ? "text-primary" : "text-red-500"
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
