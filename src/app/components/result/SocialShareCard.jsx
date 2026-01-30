"use client";

import { motion } from "framer-motion";
import {
  Circle,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  MessageSquare,
  Send,
  Share2,
  Twitter,
} from "lucide-react";

const platformIcons = {
  X_SHARE: Twitter,
  THREADS: MessageSquare,
  TIKTOK: Share2,
  IG_STORY: Instagram,
  FACEBOOK: Facebook,
  WHATSAPP: MessageCircle,
  DISCORD: MessageCircle,
  TELEGRAM: Send,
  REDDIT: Circle,
  LINKEDIN: Linkedin,
};

export default function SocialShareCard({ platform, onClick }) {
  const Icon = platformIcons[platform] || Share2;

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 20px rgba(194, 255, 2, 0.5)",
      }}
      whileTap={{ scale: 0.95 }}
      className="border border-primary py-2 px-4 text-[10px] text-primary font-bold bg-transparent hover:bg-primary/10 transition-all uppercase flex items-center justify-center gap-2 rounded-sm w-full"
      onClick={onClick}
    >
      <Icon className="w-4 h-4" />
      <span>Execute: {platform}</span>
    </motion.button>
  );
}
