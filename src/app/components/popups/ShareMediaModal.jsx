"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Copy, Download, Instagram, Loader2, Share2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ShareMediaModal({ isOpen, onClose, imageUrl, shareUrl, platform }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset states when modal opens/closes or image changes
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [isOpen, imageUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sporefall-share-${platform?.toLowerCase() || "media"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download:", err);
      window.open(imageUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const isInstagram = platform?.toUpperCase() === "IG_STORY" || platform?.toUpperCase() === "INSTAGRAM";

  // Fallback for shareUrl if not provided
  const displayUrl = shareUrl || (typeof window !== "undefined" ? window.location.href : "");

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
                {isInstagram ? (
                  <Instagram className="w-5 h-5 text-primary" />
                ) : (
                  <Share2 className="w-5 h-5 text-primary" />
                )}
                <h3 className="text-white font-subheading text-sm uppercase tracking-wider">
                  Share to {isInstagram ? "Instagram" : "TikTok"}
                </h3>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-white/50" />
              </button>
            </div>

            {/* Preview Area */}
            <div className="p-6 space-y-6">
              <div className="relative aspect-[1200/630] w-full mx-auto rounded-lg overflow-hidden border border-white/10 shadow-lg bg-black flex items-center justify-center">
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Generating Artifact...</span>
                  </div>
                )}

                {imageError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                    <span className="text-[10px] text-white/60 uppercase tracking-widest mb-1">
                      Preview Unavailable
                    </span>
                    <span className="text-[9px] text-white/30 lowercase">
                      The signal could not be visualized. You can still download the asset.
                    </span>
                  </div>
                ) : (
                  imageUrl && (
                    <Image
                      src={imageUrl}
                      alt="Spore Content Share Preview - Social Media Asset"
                      fill
                      className={`object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                      unoptimized
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                    />
                  )
                )}

                {imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4"></div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-subheading ml-1">
                    Share Link
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

                <p className="text-xs text-white/60 text-center font-body leading-relaxed">
                  Download the image and paste the link in your {isInstagram ? "Story" : "video description"}.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-lg text-xs uppercase transition-all hover:bg-primary disabled:opacity-50"
                  >
                    {downloading ? (
                      "Downloading..."
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Download Image
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 bg-zinc-800 text-white font-bold py-3 rounded-lg text-xs uppercase transition-all hover:bg-zinc-700 border border-white/10"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-primary" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy Link
                      </>
                    )}
                  </button>
                </div>
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
