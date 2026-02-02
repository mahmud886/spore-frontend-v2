"use client";

import { motion } from "framer-motion";

export default function HeroHeader({
  status = "● STATUS: ACTIVE CONFLICT // SECTOR 7",
  heading = "THE CITY IS\nDIVIDED",
  showStatus = true,
}) {
  // Split heading by newline or use <br />
  const headingLines = heading.split("\n");

  return (
    <>
      <div className="text-center pt-16 cyber-scanline cyber-screen-flicker">
        {showStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block border border-red-500/50 px-3 py-1 mb-6 cyber-glow-pulse"
          >
            <span className="text-[8px] md:text-[10px] text-red-500 font-bold tracking-[0.2em]">{status}</span>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl md:text-7xl lg:text-9xl font-oswald font-bold uppercase tracking-tighter text-primary mb-8 leading-none glitch-text cursor-default cyber-text-glitch"
        >
          {headingLines.map((line, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              {line}
              {index < headingLines.length - 1 && <br />}
            </motion.span>
          ))}
        </motion.h1>
      </div>
    </>
  );
}
