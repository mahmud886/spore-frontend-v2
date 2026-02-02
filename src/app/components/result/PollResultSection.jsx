"use client";

import { motion, useMotionValueEvent, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedPercentage({ value, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { stiffness: 50, damping: 30 });

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
  faction1 = {
    name: "EVOLVE",
    subLabel: "BASTION PARTY",
    percentage: 50,
  },
  faction2 = {
    name: "RESIST",
    subLabel: "THE NEW ALLIANCE",
    percentage: 50,
  },
  centerLabel, // Will be dynamically generated if not provided
}) {
  // Generate dynamic center label based on percentages
  const dynamicCenterLabel = centerLabel || getDynamicCenterLabel(faction1.percentage, faction2.percentage);
  return (
    <motion.section
      className="mb-12 cyber-holographic cyber-power-surge"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Labels */}
      <div className="flex justify-between items-center mb-4">
        <motion.h3
          className="text-primary text-sm font-bold tracking-widest uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {faction1.name}
        </motion.h3>
        <motion.p
          className="text-center max-w-[50%] text-[8px] text-white/60 md:text-[10px] uppercase tracking-widest"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {dynamicCenterLabel}
        </motion.p>
        <motion.h3
          className="text-accent-blue text-sm font-bold tracking-widest uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {faction2.name}
        </motion.h3>
      </div>

      {/* Progress Bar */}
      <div className="h-16 w-full flex overflow-hidden rounded-full relative cyber-border-sweep">
        <motion.div
          className="flex items-center justify-center cyber-energy-fill"
          style={{
            background: "repeating-linear-gradient(45deg, #C2FF02, #C2FF02 10px, #a8db02 10px, #a8db02 20px)",
            borderTopLeftRadius: "9999px",
            borderBottomLeftRadius: "9999px",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${faction1.percentage}%` }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AnimatedPercentage value={faction1.percentage} delay={1.5} />
        </motion.div>
        <motion.div
          className="flex items-center justify-center cyber-energy-fill"
          style={{
            background: "repeating-linear-gradient(45deg, #9ca3af, #9ca3af 10px, #ffffff 10px, #ffffff 20px)",
            borderTopRightRadius: "9999px",
            borderBottomRightRadius: "9999px",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${faction2.percentage}%` }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AnimatedPercentage value={faction2.percentage} delay={1.5} />
        </motion.div>
      </div>

      {/* Bottom Labels */}
      <div className="flex justify-between items-center mt-4">
        <motion.p
          className="text-center max-w-[50%] text-[8px] text-white/60 md:text-[10px] uppercase tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {faction1.subLabel}
        </motion.p>
        <motion.p
          className="text-center max-w-[50%] text-[8px] text-white/60 md:text-[10px] uppercase tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {faction2.subLabel}
        </motion.p>
      </div>
    </motion.section>
  );
}
