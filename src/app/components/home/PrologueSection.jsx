"use client";

import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { fadeUp } from "../../utils/animations";
import { SectionTitle } from "../shared/SectionTitle";
import { Wrapper } from "../shared/Wrapper";

export function PrologueSection() {
  // YouTube video ID - replace with actual video ID
  const youtubeVideoId = "ozEdYAQHsas"; // Placeholder - replace with actual video ID
  const [showPlayer, setShowPlayer] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(`https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`);

  return (
    <motion.section
      id="prologue"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="cyber-scanline"
    >
      {/* Video Section with Background */}
      <div className="relative rounded-lg overflow-hidden h-[500px] md:h-[800px]">
        {/* Background Image */}
        <div className="absolute inset-0 h-[800px]">
          <Image
            src="/assets/images/synopsis.webp"
            alt="Prologue Background"
            className="w-full h-full object-cover"
            fill
            sizes="100vw"
            priority={false}
            quality={60}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-white/10" />
        </div>

        {/* Section Title Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-14 px-4 md:px-0">
          <Wrapper>
            <div className="flex items-center justify-between">
              <SectionTitle>Prologue</SectionTitle>
            </div>
          </Wrapper>
        </div>

        {/* Video Container */}
        <div className="absolute inset-0 z-10 flex justify-center items-center px-4 sm:px-8">
          <div className="w-full max-w-4xl">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl border border-white/20">
              {showPlayer ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title="Prologue Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  aria-label="Play Prologue Video"
                  onClick={() => setShowPlayer(true)}
                  className="group relative w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={thumbSrc}
                    alt="Prologue Video Thumbnail"
                    fill
                    sizes="100vw"
                    priority={false}
                    quality={60}
                    className="object-cover w-full h-full"
                    onError={() => {
                      if (thumbSrc.includes("maxresdefault")) {
                        setThumbSrc(`https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`);
                      } else {
                        setThumbSrc("/assets/images/synopsis.webp");
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                  <div className="relative flex items-center gap-3 px-6 py-3 rounded-full border border-white/30 bg-black/50 text-white uppercase tracking-wide text-xs md:text-sm font-bold transition-all group-hover:bg-white group-hover:text-black group-hover:border-white">
                    <PlayCircle className="w-6 h-6 md:w-7 md:h-7" />
                    Play Prologue
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
