"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

export default function ProductImageGallery({ images = [], currentIndex = 0, onIndexChange, productName }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const nextImage = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  if (!images.length) return null;

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative aspect-square bg-black/40 border border-white/10 rounded-2xl overflow-hidden group cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full relative"
          >
            <div
              className="w-full h-full transition-transform duration-200 ease-out"
              style={{
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                transform: isZoomed ? "scale(2.5)" : "scale(1)",
              }}
            >
              <Image
                src={images[currentIndex]?.url}
                alt={images[currentIndex]?.alt || productName}
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Zoom Hint Icon (only visible when not zoomed) */}
        {!isZoomed && (
          <div className="absolute top-4 right-4 bg-black/60 text-white/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <Maximize2 size={20} />
          </div>
        )}

        {/* Navigation Arrows (hide when zoomed to prevent accidental clicks) */}
        {images.length > 1 && !isZoomed && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-primary hover:text-black text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-primary hover:text-black text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
            >
              <ArrowRight size={20} />
            </button>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 pointer-events-none z-10">
          <span className="bg-primary/90 text-black text-xs font-bold px-2 py-1 rounded">NEW ARRIVAL</span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => onIndexChange(idx)}
              className={`relative w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                currentIndex === idx
                  ? "border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt={img.alt || `Thumbnail ${idx}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
