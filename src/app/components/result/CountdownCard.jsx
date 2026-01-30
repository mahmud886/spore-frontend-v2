"use client";

import { motion } from "framer-motion";

export default function CountdownCard({ value, label, highlight = false, isRed = false }) {
  const textColor = isRed ? "text-orange-600" : "text-primary";
  const borderColor = isRed ? "border-orange-600/50" : "border-white/10";
  const labelColor = isRed ? "text-orange-600/70" : "text-white/40";

  return (
    <div className={`bg-terminal-gray/50 border ${borderColor} p-4 font-bold`}>
      <motion.div
        key={value}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0, 1] }}
        transition={{ duration: 0.3, times: [0, 0.1, 0.2, 1] }}
        className={`text-4xl text-center md:text-5xl font-mono ${textColor}`}
      >
        {value}
      </motion.div>
      <div className={`text-[8px] text-center ${labelColor} tracking-widest mt-2 uppercase`}>{label}</div>
    </div>
  );
}
