"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NotificationPopup from "../popups/NotificationPopup";

export default function ClientPollSectionFullWidth({ poll }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  if (!poll) return null;

  // Helper to extract name safely
  const getName = (opt, fallback) => {
    if (!opt) return fallback;
    return (opt.text || opt.option_text || opt.name || opt.label || opt.title || fallback).toUpperCase();
  };

  // Helper to extract description safely
  const getDescription = (opt, defaultLabel) => {
    if (!opt) return defaultLabel;
    if (opt.description) return opt.description;

    // Fallback for Evolve/Resist themes only if description is missing
    const name = getName(opt, "").toUpperCase();
    if (name === "EVOLVE" || name === "EVOLUTION")
      return "Transcend humanity. Unlock your latent code. Be something more.";
    if (name === "RESIST" || name === "RESISTANCE" || name === "CONTAIN")
      return "Preserve Order. Burn the old world. Rebuild from ashes.";

    return defaultLabel;
  };

  const firstOption = poll.options?.[0];
  const secondOption = poll.options?.[1];

  const firstOptionName = getName(firstOption, "OPTION 1");
  const secondOptionName = getName(secondOption, "OPTION 2");

  const firstOptionDescription = getDescription(firstOption, "Make your choice.");
  const secondOptionDescription = getDescription(secondOption, "Decide the future.");

  const phase = poll.title || "Phase 02: Alignment";
  const title = poll.question || poll.description || "Shape The Next Chapter of the Story";

  const subtitle = firstOption && secondOption ? `${firstOptionName} vs ${secondOptionName}` : "CHOOSE YOUR SIDE";

  const submitVote = async (optionId) => {
    if (isSubmitting) return;
    if (!poll?.episodeId || !optionId) return;
    setIsSubmitting(true);
    setShowPopup(true);
    try {
      const response = await fetch(`/api/polls/episode/${encodeURIComponent(poll.episodeId)}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      if (!response.ok) {
        setIsSubmitting(false);
        setShowPopup(false);
        return;
      }
      try {
        const votedEpisodes = JSON.parse(localStorage.getItem("sporefall_voted_episodes") || "[]");
        const eidStr = String(poll.episodeId);
        const votedStr = votedEpisodes.map((id) => String(id));
        if (!votedStr.includes(eidStr)) {
          votedEpisodes.push(poll.episodeId);
          localStorage.setItem("sporefall_voted_episodes", JSON.stringify(votedEpisodes));
        }
      } catch {}
      setTimeout(() => {
        router.push(`/result?episode=${encodeURIComponent(poll.episodeId)}`);
      }, 2000);
    } catch {
      setIsSubmitting(false);
      setShowPopup(false);
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const flickerAnimation = {
    opacity: [1, 0.8, 1, 0.9, 1],
    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)", "brightness(1.3)", "brightness(1)"],
    transition: {
      duration: 3,
      repeat: Infinity,
      times: [0, 0.2, 0.4, 0.6, 1],
    },
  };

  return (
    <>
      <NotificationPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Lionara City  Public Service"
        message={`Your Vote is Secret.\n\nRedirecting to results...`}
      />

      <div className="w-full relative overflow-hidden bg-black/40 py-20 rounded-3xl">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              {/* <span className="inline-block font-subheading text-[10px] md:text-xs tracking-[0.4em] text-white/60 mb-8 border border-white/20 px-6 py-2 rounded-full backdrop-blur-md">
              {phase}
            </span> */}
              <motion.h1
                animate={flickerAnimation}
                className="max-w-full mx-auto text-2xl md:text-5xl font-subheading font-bold tracking-widest mb-6 uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40"
              >
                {title}
              </motion.h1>

              <div className="flex items-center justify-center gap-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/20"></div>
                <p className="font-subheading text-xs md:text-sm text-primary tracking-[0.3em] uppercase">{subtitle}</p>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/20"></div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    borderColor: ["rgba(255,255,255,0.1)", "rgba(239,68,68,0.5)", "rgba(255,255,255,0.1)"],
                    boxShadow: [
                      "0 0 0px rgba(239,68,68,0)",
                      "0 0 10px rgba(239,68,68,0.2)",
                      "0 0 0px rgba(239,68,68,0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mt-4 inline-flex items-center gap-3 px-6 py-3 rounded-full border bg-white/5 backdrop-blur-md group/live cursor-default hover:border-red-500/50 transition-colors duration-500"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Outer pulse ring */}
                    <motion.div
                      animate={{
                        scale: [1, 1.8],
                        opacity: [0.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className="absolute w-2 h-2 rounded-full bg-red-500"
                    />
                    {/* Main dot with glow */}
                    <motion.div
                      animate={{
                        opacity: [1, 0.5, 1],
                        boxShadow: [
                          "0 0 4px rgba(239,68,68,0.4)",
                          "0 0 12px rgba(239,68,68,0.8)",
                          "0 0 4px rgba(239,68,68,0.4)",
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-2 h-2 rounded-full bg-red-500 relative z-10"
                    />
                  </div>
                  <motion.p
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="font-subheading text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/70 group-hover/live:text-red-500 transition-colors"
                  >
                    Live Poll
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Voting Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full max-w-5xl">
              {/* Evolve Option (White) */}
              <motion.button
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onClick={() => firstOption?.id && submitVote(firstOption.id)}
                disabled={isSubmitting}
                className="cursor-pointer group relative flex flex-col items-center text-center p-12 rounded-3xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-800/60 transition-all duration-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.02)] hover:shadow-[0_0_60px_rgba(255,255,255,0.08)]"
              >
                {/* Outer Card Glow like the image */}
                <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <motion.div
                  animate={pulseAnimation}
                  className="absolute inset-0 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                ></motion.div>

                {/* Icon Container with Concentrated Glow like the image */}
                <div className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500">
                  {/* The "Aura" behind the icon */}
                  <div className="absolute inset-0 bg-white/10 blur-[30px] rounded-full group-hover:bg-white/20 transition-all duration-500"></div>
                  <div className="absolute inset-4 bg-white/5 blur-[15px] rounded-full group-hover:bg-white/10 transition-all duration-500"></div>

                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 30px rgba(255,255,255,0.1)",
                        "0 0 60px rgba(255,255,255,0.4)",
                        "0 0 30px rgba(255,255,255,0.1)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border border-white/10"
                  ></motion.div>

                  <Image
                    src="/assets/images/evolve.png"
                    alt="Evolve"
                    width={72}
                    height={72}
                    className="relative z-20 opacity-90 group-hover:opacity-100 transition-opacity brightness-125"
                  />
                </div>

                <h2 className="relative z-10 text-4xl md:text-5xl font-subheading font-bold text-white group-hover:text-white mb-6 tracking-widest uppercase transition-all duration-300">
                  {firstOptionName}
                </h2>

                <p className="relative z-10 font-body text-sm leading-relaxed text-white/40 max-w-xs group-hover:text-white/80 transition-colors duration-300 italic">
                  {firstOptionDescription}
                </p>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-white group-hover:w-1/2 transition-all duration-500"></div>
              </motion.button>

              {/* Resist Option (Green) */}
              <motion.button
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onClick={() => secondOption?.id && submitVote(secondOption.id)}
                disabled={isSubmitting}
                className="cursor-pointer group relative flex flex-col items-center text-center p-12 rounded-3xl border border-primary/10 bg-zinc-900/40 hover:bg-zinc-800/60 transition-all duration-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-xl shadow-[0_0_30px_rgba(212,255,0,0.02)] hover:shadow-[0_0_60px_rgba(212,255,0,0.08)]"
              >
                {/* Outer Card Glow like the image */}
                <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <motion.div
                  animate={pulseAnimation}
                  className="absolute inset-0 bg-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                ></motion.div>

                {/* Icon Container with Concentrated Glow like the image */}
                <div className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500">
                  {/* The "Aura" behind the icon */}
                  <div className="absolute inset-0 bg-primary/10 blur-[30px] rounded-full group-hover:bg-primary/20 transition-all duration-500"></div>
                  <div className="absolute inset-4 bg-primary/5 blur-[15px] rounded-full group-hover:bg-primary/10 transition-all duration-500"></div>

                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 30px rgba(212,255,0,0.1)",
                        "0 0 60px rgba(212,255,0,0.5)",
                        "0 0 30px rgba(212,255,0,0.1)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute inset-0 rounded-full border border-primary/10"
                  ></motion.div>

                  <Image
                    src="/assets/images/resist.png"
                    alt="Resist"
                    width={72}
                    height={72}
                    className="relative z-20 opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                <h2 className="relative z-10 text-4xl md:text-5xl font-subheading font-bold text-white group-hover:text-primary mb-6 tracking-widest uppercase transition-all duration-300">
                  {secondOptionName}
                </h2>

                <p className="relative z-10 font-body text-sm leading-relaxed text-white/40 max-w-xs group-hover:text-white/80 transition-colors duration-300 italic">
                  {secondOptionDescription}
                </p>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary group-hover:w-1/2 transition-all duration-500"></div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
