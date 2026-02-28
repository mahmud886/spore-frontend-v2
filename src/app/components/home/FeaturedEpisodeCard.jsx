"use client";

import Image from "next/image";
import { AnimatedCard } from "../shared/AnimatedWrapper";

export default function FeaturedEpisodeCard({ episode, onWatchClick }) {
  if (!episode) return null;

  return (
    <AnimatedCard
      hoverGlow={true}
      hoverFloat={true}
      className="h-full"
      style={{
        borderTopRightRadius: "20px",
        borderBottomLeftRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div
        className={`group relative overflow-hidden transition-all duration-300 h-full min-h-[450px] box-shadow-xl border-2 border-transparent cursor-pointer ${
          episode.status === "available"
            ? "hover:border-primary"
            : episode.status === "upcoming"
              ? "hover:border-orange-600"
              : "hover:border-gray-700"
        }`}
        style={{
          borderTopRightRadius: "20px",
          borderBottomLeftRadius: "20px",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onWatchClick) onWatchClick(episode);
        }}
      >
        {/* Background Image Container with matching radius */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderTopRightRadius: "20px",
            borderBottomLeftRadius: "20px",
          }}
        >
          <Image
            alt={`Featured Episode: ${episode.title}`}
            className={`object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ${
              episode.status === "locked" || episode.status === "upcoming" ? "grayscale" : ""
            }`}
            src={episode.thumbnail}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
          />
          {/* Overlay Gradient with matching radius */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"
            style={{
              borderTopRightRadius: "20px",
              borderBottomLeftRadius: "20px",
            }}
          />
        </div>

        {/* Absolute Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          {/* Status Badge */}
          <div className="absolute top-6 left-6">
            {episode.status === "available" && (
              <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 uppercase flex items-center gap-2 rounded border border-primary/30">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span> Featured
              </span>
            )}
            {episode.status === "upcoming" && (
              <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 uppercase flex items-center gap-2 rounded border border-orange-600/30">
                <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span> Upcoming
              </span>
            )}
          </div>

          <div className="space-y-3 transform transition-transform duration-300">
            <h4 className="text-[28px] md:text-[36px] font-display font-bold uppercase tracking-wider text-white leading-tight">
              {episode.title}
            </h4>
            <p className="text-[14px] md:text-[16px] text-white/80 line-clamp-2 font-subheading max-w-2xl">
              {episode.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/10">
            <span className="text-[11px] uppercase tracking-widest text-white/60 font-medium">
              Runtime: {episode.runtime}
            </span>

            <div className="flex gap-3">
              {episode.status === "available" && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onWatchClick) onWatchClick(episode);
                  }}
                  className="bg-primary text-black text-[12px] font-bold px-8 py-2.5 uppercase rounded-tr-lg rounded-bl-lg hover:bg-white transition-colors duration-300"
                >
                  Watch Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
