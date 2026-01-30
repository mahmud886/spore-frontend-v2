"use client";

import { X } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function YouTubeModal({ isOpen, onClose, videoUrl, title = "Watch Episode" }) {
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    // Set mounted to true after component mounts to safely use createPortal
    setIsMounted(true);

    // Cleanup function
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  // Don't render if not mounted or no video ID
  if (!isMounted || !isOpen || !videoId) return null;

  const handleClose = () => {
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-4xl h-[80vh] bg-black border border-primary rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary bg-black/50">
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">{title}</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* YouTube Video */}
        <div className="w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              // Video loaded successfully
            }}
            onError={() => {
              console.error("Failed to load YouTube video");
            }}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
