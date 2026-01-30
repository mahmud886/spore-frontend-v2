"use client";

import { X } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function NotificationPopup({ isOpen, onClose, message, title = "Notice" }) {
  const isMountedRef = useRef(false);

  useLayoutEffect(() => {
    // Set isMounted to true when component mounts
    isMountedRef.current = true;

    // Auto-close after 3 seconds
    if (isOpen) {
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [isOpen, onClose]);

  if (!isMountedRef.current || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md">
        <div className="w-full bg-black rounded-[32px] border border-white/10 p-8 shadow-2xl relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:border-primary hover:text-black transition-all duration-200 z-20"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">{title}</h3>
            <p className="text-white/80 text-lg font-medium">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
