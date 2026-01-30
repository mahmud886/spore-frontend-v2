"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fadeUp, staggerContainer } from "../../utils/animations";
import { AnimatedWrapper } from "../shared/AnimatedWrapper";
import { SectionTitle } from "../shared/SectionTitle";
import SocialShareCard from "./SocialShareCard";

const defaultPlatforms = [
  "FACEBOOK",
  "WHATSAPP",
  "DISCORD",
  "TELEGRAM",
  "LINKEDIN",
  "X_SHARE",
  "THREADS",
  "TIKTOK",
  "IG_STORY",
  "REDDIT",
];

export default function MobilizeNetworkCard({ title, description, platforms = defaultPlatforms, onShare, copied }) {
  const [signalCount, setSignalCount] = useState(10984);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch("/api/signals");
        const data = await response.json();

        if (response.ok && data.signal_count) {
          setSignalCount(data.signal_count);
        }
      } catch (error) {
        console.error("Failed to fetch signals:", error);
        // Keep default value on error
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();

    // Update signals every minute
    const interval = setInterval(fetchSignals, 60000);

    return () => clearInterval(interval);
  }, []);
  const handleShare = (platform) => {
    if (onShare) {
      onShare(platform);
    }
  };

  return (
    <AnimatedWrapper variant={fadeUp} className="space-y-4 mb-24">
      <SectionTitle className="">Mobilize Your Network</SectionTitle>
      <div className="bg-black/50 border font-body border-white/10 p-6 text-center mt-10 py-12 cyber-scanline cyber-data-stream cyber-power-surge">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-primary font-light text-[26px] md:text-[36px] tracking-normal uppercase mb-2 cyber-text-glitch"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm text-white/50 font-body tracking-widest leading-relaxed mb-12"
        >
          {description}
        </motion.p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
        >
          {platforms.map((platform, index) => (
            <motion.div key={index} variants={fadeUp} whileHover={{ scale: 1.05, y: -3 }}>
              <SocialShareCard platform={platform} onClick={() => handleShare(platform)} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10"
        >
          <h3 className="text-white/50 text-[14px] font-light md:text-[18px]  uppercase mb-2">
            Your Contribution Is Vital
          </h3>
          <p className="text-[18px] md:text-[26px] text-white/50 font-subheading tracking-widest leading-relaxed mb-6 font-bold">
            <span className="text-primary font-bold">{loading ? "10, 984" : signalCount.toLocaleString()}</span> signals
            broadcasted
          </p>
        </motion.div>
      </div>
    </AnimatedWrapper>
  );
}
