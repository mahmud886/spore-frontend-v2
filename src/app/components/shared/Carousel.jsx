"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Carousel({
  items = [],
  renderItem,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 4 },
  showPagination = true,
  showNavigation = true,
  className = "",
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  autoPlayInterval = 5000,
  autoPlayPauseOnHover = true,
  resumeAfterInteractionDelay = 5000,
  title = null,
  titleComponent = null,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(itemsPerView.desktop);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const autoPlayTimerRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const prevTotalSlidesRef = useRef(0);

  // Drag-related state and refs
  const startXRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const touchElementRef = useRef(null);
  const containerRef = useRef(null);

  // Drag animation state
  const [dragPosition, setDragPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerSlide(itemsPerView.desktop);
      } else if (window.innerWidth >= 768) {
        setItemsPerSlide(itemsPerView.tablet);
      } else {
        setItemsPerSlide(itemsPerView.mobile);
      }
      // Reset to first slide when viewport changes
      setCurrentIndex(0);
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, [itemsPerView]);

  // Calculate total slides - scroll item by item, not in groups
  // Total slides = total items (since we scroll one at a time)
  const totalSlides = items.length;
  const currentPage = Math.min(currentIndex + 1, totalSlides);

  // Auto-play functionality
  useEffect(() => {
    if (items.length === 0 || items.length <= 1) return;

    // Clear any existing interval
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    // Only start auto-play if not paused and not hovering
    if (!isAutoPlayPaused && !isHovering) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          // Loop infinitely - scroll one item at a time
          return (prev + 1) % items.length;
        });
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [isAutoPlayPaused, isHovering, autoPlayInterval, items.length]);

  // Handle user interaction - pause auto-play
  const pauseAutoPlay = () => {
    setIsAutoPlayPaused(true);
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
  };

  // Resume auto-play after delay
  const scheduleResume = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setIsAutoPlayPaused(false);
    }, resumeAfterInteractionDelay);
  };

  const goToNext = () => {
    pauseAutoPlay();

    setCurrentIndex((prev) => {
      const nextIndex = (prev + 1) % items.length;
      return nextIndex;
    }); // Loop infinitely
    scheduleResume();
  };

  const goToPrev = () => {
    pauseAutoPlay();

    setCurrentIndex((prev) => {
      const prevIndex = (prev - 1 + items.length) % items.length;
      return prevIndex;
    }); // Loop infinitely
    scheduleResume();
  };

  // Drag functions
  const touchStart = (e) => {
    const event = e.type.includes("touch") ? e.touches[0] : e;
    startXRef.current = event.clientX;
    dragStartTimeRef.current = Date.now();
    setIsDragging(true);

    pauseAutoPlay();
  };

  const touchMove = (e) => {
    if (!isDragging) return;

    const event = e.type.includes("touch") ? e.touches[0] : e;
    const diffX = event.clientX - startXRef.current;
    setDragPosition(diffX);
  };

  const touchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    const endTime = Date.now();
    const duration = endTime - dragStartTimeRef.current;
    const distance = dragPosition;
    const velocity = Math.abs(distance) / duration;

    // Determine if we should move to next/previous slide
    const threshold = 50; // Minimum distance to trigger a slide change
    const velocityThreshold = 0.5; // Minimum velocity to trigger a slide change

    if (Math.abs(distance) > threshold || velocity > velocityThreshold) {
      if (distance > 0) {
        // Swipe right - go to previous
        goToPrev();
      } else {
        // Swipe left - go to next
        goToNext();
      }
    }

    setDragPosition(0);

    scheduleResume();
  };

  // Handle hover pause
  const handleMouseEnter = () => {
    if (autoPlayPauseOnHover) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (autoPlayPauseOnHover) {
      setIsHovering(false);
    }
  };

  // Show items starting from currentIndex, wrapping around if needed
  const getVisibleItems = () => {
    if (!items || items.length === 0) return [];
    const visible = [];
    for (let i = 0; i < itemsPerSlide; i++) {
      const index = (currentIndex + i) % items.length;
      const item = items[index];
      if (item !== undefined) {
        visible.push({ item, originalIndex: index });
      }
    }
    return visible;
  };

  const visibleItems = getVisibleItems();

  return (
    <div className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Title and Navigation Controls in one line */}
      {(title || titleComponent || showNavigation) && (
        <div className="flex items-center justify-between mb-12">
          {/* Title */}
          {titleComponent || (title && <div>{title}</div>)}

          {/* Navigation Controls */}
          {showNavigation && (
            <div className="flex gap-1.5 sm:gap-2 md:gap-4 items-center">
              <button
                onClick={goToPrev}
                disabled={items.length <= 1}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border border-white/20 rounded-full flex items-center justify-center text-white/40 hover:text-primary hover:border-primary transition-colors bg-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </button>
              {showPagination && (
                <div className="px-1 sm:px-1 md:px-4 py-0.5 sm:py-1 md:py-1.5 border-2 border-primary bg-primary text-black font-mono text-[10px] sm:text-xs md:text-sm tracking-normal md:tracking-widest rounded">
                  {currentPage}/{totalSlides}
                </div>
              )}
              <button
                onClick={goToNext}
                disabled={items.length <= 1}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border border-white/20 rounded-full flex items-center justify-center text-white/40 hover:text-primary hover:border-primary transition-colors bg-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Carousel Grid with basic functionality */}
      <div ref={containerRef} className="relative overflow-hidden">
        <div
          className={gridClassName}
          key={currentIndex}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={touchStart}
          onMouseMove={touchMove}
          onMouseUp={touchEnd}
          onMouseLeave={touchEnd}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
        >
          <AnimatePresence mode="popLayout">
            {visibleItems.map(({ item, originalIndex }, index) => (
              <motion.div
                key={`${originalIndex}-${currentIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderItem(item, originalIndex)}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
