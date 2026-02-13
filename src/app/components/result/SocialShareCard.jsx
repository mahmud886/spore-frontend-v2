"use client";

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
    <button
      className="border border-primary py-2 px-4 text-[10px] text-primary font-bold bg-transparent hover:bg-primary/10 hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(194,255,2,0.5)] active:scale-[0.95] transition-all uppercase flex items-center justify-center gap-2 rounded-sm w-full cursor-pointer active:opacity-70 touch-manipulation"
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <Icon className="w-4 h-4" />
      <span>Execute: {platform}</span>
    </button>
  );
}
