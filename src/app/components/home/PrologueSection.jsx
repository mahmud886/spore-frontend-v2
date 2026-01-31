"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp } from "../../utils/animations";
import { SectionTitle } from "../shared/SectionTitle";
import { Wrapper } from "../shared/Wrapper";

export function PrologueSection() {
  // YouTube video ID - replace with actual video ID
  const youtubeVideoId = "ozEdYAQHsas"; // Placeholder - replace with actual video ID

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
      <div className="relative rounded-lg overflow-hidden h-[800px]">
        {/* Background Image */}
        <div className="absolute inset-0 h-[800px]">
          <Image
            src="/assets/images/synopsis.png"
            alt="Prologue Background"
            className="w-full h-full object-cover"
            fill
            sizes="100vw"
            priority={false}
            quality={75}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-white/10" />
        </div>

        {/* Section Title Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-14">
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
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
                title="Prologue Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
