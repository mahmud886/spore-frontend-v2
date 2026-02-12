"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp } from "../../utils/animations";
import { AnimatedWrapper } from "../shared/AnimatedWrapper";
import { SectionTitle } from "../shared/SectionTitle";

export default function FundMovieSection() {
  return (
    <AnimatedWrapper variant={fadeUp} className="mb-24">
      <div className="mb-12">
        <SectionTitle>Bring Spore Fall into Cinemas</SectionTitle>
      </div>
      <div className="relative  mx-auto group">
        {/* Nebula/Space background container for the whole section */}
        <div className="relative p-6 md:p-12 overflow-hidden bg-black/50 border border-white/5 shadow-2xl">
          {/* Nebula Glow Effects */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-purple-900/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-blue-900/10 blur-[120px] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-900/5 blur-[100px] rounded-full" />
          </div>

          {/* Main Cinema Theater Card with Neon Border */}
          <div className="relative z-10 p-0.5 md:p-1 rounded-2xl bg-primary/40 shadow-[0_0_40px_rgba(212,255,0,0.1)] group-hover:shadow-[0_0_60px_rgba(212,255,0,0.2)] transition-all duration-700">
            <div className="relative bg-black rounded-xl overflow-hidden border border-primary/20">
              {/* Cinema Image Container */}
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src="/assets/images/fund-the-movie.webp"
                  alt="Fund The Movie"
                  fill
                  sizes="(max-width: 1268px) 100vw, 1268px"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />

                {/* Cinema Lighting Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

                {/* Text on the screen/theater area */}
                {/* <div className="absolute inset-0 flex flex-col items-center justify-end pb-[5%] md:pb-[10%]">
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-white font-subheading text-sm md:text-3xl lg:text-5xl md:tracking-[0.25em] font-bold text-center px-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] uppercase"
                  >
                    BRING SPORE FALL INTO CINEMAS
                  </motion.h2>
                </div> */}
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="relative z-10 mt-10 md:mt-16 flex justify-center">
            <motion.a
              href="/support-us"
              target="_blank"
              aria-label="Fund the movie"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 35px rgba(212, 255, 0, 0.6)",
                backgroundColor: "#e5ff00",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary justify-center text-center text-black font-subheading font-bold py-4 md:py-6 px-12 md:px-24 rounded-md tracking-[0.3em] text-sm md:text-2xl transition-all duration-300 shadow-[0_0_20px_rgba(212,255,0,0.3)] uppercase cursor-pointer"
            >
              FUND THE MOVIE
            </motion.a>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
}
