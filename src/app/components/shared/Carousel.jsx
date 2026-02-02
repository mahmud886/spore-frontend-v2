"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Carousel({
  items = [],
  renderItem,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 4 },
  showPagination = true,
  showNavigation = true,
  className = "",
  autoPlayInterval = 5000,
  autoPlayPauseOnHover = true,
  title = null,
  titleComponent = null,
  slidesToScroll = 1,
  lazyInit = false,
}) {
  const [isInView, setIsInView] = useState(!lazyInit);
  const [rootEl, setRootEl] = useState(null);

  useEffect(() => {
    if (!lazyInit || !rootEl) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "100px" },
    );
    obs.observe(rootEl);
    return () => obs.disconnect();
  }, [lazyInit, rootEl]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [computedSlidesToScroll, setComputedSlidesToScroll] = useState(
    typeof slidesToScroll === "number" ? slidesToScroll : slidesToScroll?.desktop || 1,
  );

  const emblaOptions = useMemo(
    () => ({
      loop: true,
      slidesToScroll: computedSlidesToScroll,
      align: "start",
    }),
    [computedSlidesToScroll],
  );

  const plugins = useMemo(
    () => [
      Autoplay({
        delay: autoPlayInterval,
        stopOnMouseEnter: autoPlayPauseOnHover,
        stopOnInteraction: false,
      }),
    ],
    [autoPlayInterval, autoPlayPauseOnHover],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, plugins);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit(emblaOptions);
    }
  }, [items.length, emblaApi, emblaOptions]);

  useEffect(() => {
    const handleResize = () => {
      let val = 1;
      if (typeof slidesToScroll === "number") {
        val = slidesToScroll;
      } else {
        if (window.innerWidth >= 1024) {
          val = slidesToScroll?.desktop || 1;
        } else if (window.innerWidth >= 768) {
          val = slidesToScroll?.tablet || 1;
        } else {
          val = slidesToScroll?.mobile || 1;
        }
      }
      setComputedSlidesToScroll(val);
      if (emblaApi) {
        emblaApi.reInit({ ...emblaOptions, slidesToScroll: val });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [slidesToScroll, emblaApi, emblaOptions]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const goPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };
  const goNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const basisFor = (n) => {
    if (n === 1) return "basis-full";
    if (n === 2) return "basis-1/2";
    if (n === 3) return "basis-1/3";
    return "basis-1/4";
  };

  const mobileCols = itemsPerView.mobile || 1;
  const tabletCols = itemsPerView.tablet || 2;
  const desktopCols = itemsPerView.desktop || 4;
  const mobileWidthPct = `${100 / mobileCols}%`;
  const tabletWidthPct = `${100 / tabletCols}%`;
  const desktopWidthPct = `${100 / desktopCols}%`;
  const [slideWidthPct, setSlideWidthPct] = useState(mobileWidthPct);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlideWidthPct(desktopWidthPct);
      } else if (window.innerWidth >= 768) {
        setSlideWidthPct(tabletWidthPct);
      } else {
        setSlideWidthPct(mobileWidthPct);
      }
      if (emblaApi) {
        emblaApi.reInit(emblaOptions);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileWidthPct, tabletWidthPct, desktopWidthPct, emblaApi, emblaOptions]);
  const slideClass = `embla-slide px-2`;

  const effectiveItems = items.length <= desktopCols ? [...items, ...items] : items;

  const totalSlides = items.length;
  const currentPage = Math.min(selectedIndex + 1, totalSlides);

  if (!isInView) {
    const mobileCols = itemsPerView.mobile || 1;
    const tabletCols = itemsPerView.tablet || 2;
    const desktopCols = itemsPerView.desktop || 4;
    const gridCols = `grid grid-cols-${mobileCols} md:grid-cols-${tabletCols} lg:grid-cols-${desktopCols} gap-4`;
    return (
      <div className={className} ref={setRootEl}>
        {(title || titleComponent) && <div className="mb-12">{titleComponent || (title && <div>{title}</div>)}</div>}
        <div className={gridCols}>
          {items.map((item, i) => (
            <div key={`static-${i}`}>{renderItem(item, i)}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className} ref={setRootEl}>
      {(title || titleComponent || showNavigation) && (
        <div className="flex items-center justify-between mb-12">
          {titleComponent || (title && <div>{title}</div>)}
          {showNavigation && (
            <div className="flex gap-1.5 sm:gap-2 md:gap-4 items-center">
              <button
                onClick={goPrev}
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
                onClick={goNext}
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
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {effectiveItems.map((item, i) => (
            <div key={`slide-${i}`} className={slideClass} style={{ flex: `0 0 ${slideWidthPct}` }}>
              {renderItem(item, i % items.length)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
