"use client";

import { motion, useMotionValueEvent, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedPercentage({ value, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { stiffness: 20, damping: 20 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  return (
    <motion.span
      className="text-black font-black text-2xl"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        duration: 0.5,
        delay: delay,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      {displayValue}%
    </motion.span>
  );
}

function getDynamicCenterLabel(faction1Percentage, faction2Percentage) {
  const diff = Math.abs(faction1Percentage - faction2Percentage);

  // Scenario 1: Close tie (within 10% difference)
  if (diff <= 10) {
    return "THE CITY STANDS DIVIDED";
  }

  // Scenario 2: Faction 2 dominant (Resist wins significantly)
  if (faction2Percentage > faction1Percentage && diff > 20) {
    return "TIGHTEN CONTROL. HOLD THE LINE";
  }

  // Scenario 3: Faction 1 dominant (Evolve wins significantly)
  if (faction1Percentage > faction2Percentage && diff > 20) {
    return "A NEW DAWN ARISES. WE SHAPE THE FUTURE";
  }

  // Fallback for moderate differences (10-20% difference)
  if (faction1Percentage > faction2Percentage) {
    return "EVOLUTION GAINS MOMENTUM";
  } else {
    return "RESISTANCE HOLDS STRONG";
  }
}

export default function PollResultSection({
  faction1 = { name: "OPTION 1", subLabel: "Loading...", percentage: 50 },
  faction2 = { name: "OPTION 2", subLabel: "Loading...", percentage: 50 },
  centerLabel, // Will be dynamically generated if not provided
}) {
  // Generate dynamic center label based on percentages
  const dynamicCenterLabel = centerLabel || getDynamicCenterLabel(faction1.percentage, faction2.percentage);
  return (
    <motion.section
      // cyber-holographic cyber-power-surge
      className="mb-12 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Top Labels */}
      <div className="flex justify-between items-center mb-4">
        <motion.h3
          className="text-white text-sm font-bold tracking-widest uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          {faction1.name}
        </motion.h3>
        {/* <motion.p
          className="text-center max-w-[50%] text-[8px] text-white/60 md:text-[10px] uppercase tracking-widest"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          {dynamicCenterLabel}
        </motion.p> */}
        <motion.h3
          className="text-primary text-sm font-bold tracking-widest uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          {faction2.name}
        </motion.h3>
      </div>

      {/* Progress Bar */}
      <div className="h-16 w-full flex overflow-hidden rounded-full relative border border-white/10 bg-black/40 backdrop-blur-sm shadow-inner">
        <motion.div
          className="flex items-center justify-center cyber-energy-fill"
          style={{
            background: "repeating-linear-gradient(45deg, #9ca3af, #9ca3af 10px, #ffffff 10px, #ffffff 20px)",
            backgroundSize: "28px 28px",
            borderTopLeftRadius: "9999px",
            borderBottomLeftRadius: "9999px",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${faction1.percentage}%` }}
          transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AnimatedPercentage value={faction1.percentage} delay={3.0} />
        </motion.div>
        <motion.div
          className="flex items-center justify-center cyber-energy-fill"
          style={{
            background: "repeating-linear-gradient(45deg, #C2FF02, #C2FF02 10px, #a8db02 10px, #a8db02 20px)",
            backgroundSize: "28px 28px",
            borderTopRightRadius: "9999px",
            borderBottomRightRadius: "9999px",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${faction2.percentage}%` }}
          transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AnimatedPercentage value={faction2.percentage} delay={3.0} />
        </motion.div>

        {/* VS Indicator */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ left: `${faction1.percentage}%` }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 3.5, type: "spring", stiffness: 200 }}
            className="bg-black border-2 border-red-500 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]"
          >
            <span className="text-red-500 font-black text-sm italic tracking-tighter">VS</span>
          </motion.div>
        </div>
      </div>

      {/* Bottom Labels */}
      <div className="flex justify-between items-center mt-4">
        <motion.p
          className="text-center max-w-[50%] text-[8px] font-bold text-white/60 md:text-[10px] uppercase tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          {faction1.subLabel}
        </motion.p>
        <motion.p
          className="text-center max-w-[50%] text-[8px] font-bold text-white/60 md:text-[10px] uppercase tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.0 }}
        >
          {faction2.subLabel}
        </motion.p>
      </div>
    </motion.section>
  );
}
