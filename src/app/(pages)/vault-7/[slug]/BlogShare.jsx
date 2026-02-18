"use client";

import ShareMediaModal from "@/app/components/popups/ShareMediaModal";
import SocialShareCard from "@/app/components/result/SocialShareCard";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Share2, X } from "lucide-react";
import { useState } from "react";

const SHARE_PLATFORMS = ["FACEBOOK", "X_SHARE", "LINKEDIN", "WHATSAPP", "TELEGRAM", "REDDIT", "IG_STORY", "TIKTOK"];

export default function BlogShare({ title, slug, coverImage }) {
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaPlatform, setMediaPlatform] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/vault-7/${slug}`;
    }
    return "";
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform) => {
    const url = getShareUrl();
    if (!url) return;

    const text = `${title} - Read on SPORE FALL`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    // Handle visual platforms that need the media modal
    if (platform === "IG_STORY" || platform === "TIKTOK" || platform === "INSTAGRAM") {
      setShareUrl(url);
      setMediaPlatform(platform === "IG_STORY" ? "Instagram" : "TikTok");
      setIsMediaModalOpen(true);
      setIsSelectionOpen(false);
      return;
    }

    let link = "";
    switch (platform) {
      case "FACEBOOK":
        link = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "X_SHARE":
      case "TWITTER":
        link = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "LINKEDIN":
        link = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "WHATSAPP":
        link = `https://wa.me/?text=${encodedText}%0A${encodedUrl}`;
        break;
      case "TELEGRAM":
        link = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "REDDIT":
        link = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
        break;
      default:
        break;
    }

    if (link) {
      window.open(link, "_blank", "noopener,noreferrer,width=600,height=400");
      setIsSelectionOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsSelectionOpen(true)}
        className="px-6 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded transition-colors uppercase font-mono text-sm tracking-wider flex items-center gap-2"
      >
        <Share2 size={16} />
        Share Transmission
      </button>

      {/* Selection Modal */}
      <AnimatePresence>
        {isSelectionOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsSelectionOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  <h3 className="text-white font-heading text-lg uppercase tracking-wider">Select Frequency</h3>
                </div>
                <button
                  onClick={() => setIsSelectionOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/50" />
                </button>
              </div>

              {/* Grid */}
              <div className="p-8 space-y-8">
                {/* Input Field for Copy */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl()}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-sm text-white/80 font-mono outline-none focus:border-primary/50 transition-colors pr-24"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="absolute right-1 top-1 bottom-1 px-4 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {SHARE_PLATFORMS.map((platform) => (
                    <SocialShareCard key={platform} platform={platform} onClick={() => handleShare(platform)} />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-black/40 p-4 text-center border-t border-white/5">
                <p className="text-xs text-white/40 font-mono">TRANSMISSION SECURE // READY TO BROADCAST</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Modal (for visual platforms) */}
      <ShareMediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        imageUrl={coverImage}
        shareUrl={shareUrl}
        platform={mediaPlatform}
      />
    </>
  );
}
