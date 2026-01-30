"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp, slideInLeft, slideInRight } from "../../utils/animations";
import { AnimatedWrapper } from "../shared/AnimatedWrapper";

export default function AboutHeader() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center cyber-grid-bg cyber-hex-grid">
      <AnimatedWrapper variant={slideInLeft} className="space-y-8">
        <div>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono text-primary text-sm tracking-[0.3em] uppercase mb-4 block cyber-text-glitch"
          >
            About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-7xl md:text-9xl font-black text-primary italic leading-none tracking-tighter cyber-text-glitch"
          >
            SPORE
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-l-2 border-primary/40 pl-8 max-w-xl"
        >
          <p className="text-lg md:text-xl leading-relaxed text-white/70 font-light">
            is a multi-platform narrative universe that re-imagines Singaporean identity through speculative fiction,
            blending AI-enhanced storytelling, and powered by web 3.0 community engagement.
          </p>
        </motion.div>
      </AnimatedWrapper>
      <AnimatedWrapper variant={slideInRight} className="relative flex justify-center lg:justify-end">
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          className="video-card-border w-full max-w-md cyber-glitch-hover"
        >
          <div className="bg-terminal-gray rounded-sm overflow-hidden border border-white/10 group cursor-pointer relative cyber-hologram">
            <Image
              alt="Episode Preview"
              className="w-full aspect-[2/3] object-cover opacity-40 group-hover:opacity-60 transition-opacity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKnxVs1-FKyRHwg68QCQiOT_wE7qZPxXZ81q-6YBb27bQsKIXaiUSeqFyg6I5dVtl-lq3PjeFHkZKV07IdAXdeYgfqHKQzWFxKqH_H05QBfs8ZrrTWN6Cub_3wew-CX3GcEUGxwsmaQTHG1jEzLrz68Elgibvj-BkThb4m-iiwO7WZxpF6pl3EMgDZP9v-U5zcrMQqJ-f-Q-jalNXwSMp-n06SiZQBAt9UY0N_2K62Qv1CGT5LdOeyyV6Y-D7_1J1zvSX8C8_Xfo8"
              width={400}
              height={600}
              unoptimized
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center bg-white/5 group-hover:bg-primary/20 transition-all cyber-glow-pulse"
              >
                <span className="material-symbols-outlined text-white text-4xl translate-x-0.5">play_arrow</span>
              </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
              <span className="font-mono text-primary text-xs tracking-widest block mb-2">EPISODE 01</span>
              <h3 className="font-display text-2xl font-bold text-white uppercase">The Outbreak</h3>
            </div>
          </div>
        </motion.div>
      </AnimatedWrapper>
    </section>
  );
}
