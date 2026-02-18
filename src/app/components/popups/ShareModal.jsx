"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Facebook, Linkedin, MessageCircle, Send, Share2, Twitter, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ShareModal({ isOpen, onClose, shareUrl, title }) {
  const [copied, setCopied] = useState(false);

  // Reset copied state when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setCopied(false), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const displayUrl = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(displayUrl);
  const encodedTitle = encodeURIComponent(title || "Check out this product!");

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-blue-500",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:text-sky-500",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:text-green-500",
    },
    {
      name: "Telegram",
      icon: Send,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:text-blue-600",
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (url) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                <h3 className="text-white font-subheading text-sm uppercase tracking-wider">Share Product</h3>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-white/50" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Link Copy */}
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-subheading ml-1">
                  Product Link
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={displayUrl}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-sm text-white/80 font-body outline-none focus:border-primary/50 transition-colors pr-12"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute right-2 p-2 text-white/40 hover:text-primary transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Social Icons */}
              <div className="grid grid-cols-5 gap-2">
                {shareLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleShare(link.url)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group ${link.color}`}
                    title={`Share on ${link.name}`}
                  >
                    <link.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{link.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-black/40 p-4 text-center">
              <button
                onClick={onClose}
                className="text-[10px] text-white/40 uppercase tracking-[0.2em] hover:text-primary transition-colors"
              >
                Close Portal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
