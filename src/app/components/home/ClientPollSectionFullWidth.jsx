"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClientPollSectionFullWidth({ poll }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!poll) return null;

  const firstOption = poll.options?.[0];
  const secondOption = poll.options?.[1];
  const firstOptionName = firstOption?.name || firstOption?.text || "EVOLVE";
  const secondOptionName = secondOption?.name || secondOption?.text || "RESIST";
  const firstOptionDescription =
    firstOption?.description || "Transcend humanity. Unlock your latent code. Be something more.";
  const secondOptionDescription =
    secondOption?.description || "Preserve Order. Burn the old world. Rebuild from ashes.";
  const phase = poll.title || "Phase 02: Alignment";
  const title = poll.question || poll.description || "Shape The Next Chapter of the Story";
  const subtitle = poll.options?.length
    ? poll.options
        .map((opt) => opt?.name || opt?.text || "")
        .filter(Boolean)
        .join(" vs ")
    : "RESIST vs EVOLVE";

  const submitVote = async (optionId) => {
    if (isSubmitting) return;
    if (!poll?.episodeId || !optionId) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/polls/episode/${encodeURIComponent(poll.episodeId)}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setIsSubmitting(false);
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
      }, 100);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block font-subheading text-[10px] md:text-xs tracking-[0.3em] text-white/50 mb-6 uppercase border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              {phase}
            </span>
            <h1 className="text-4xl md:text-6xl font-subheading font-bold tracking-wider mb-4 uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              {title}
            </h1>
            <p className="font-subheading text-sm md:text-base text-white/40 tracking-widest uppercase">{subtitle}</p>
          </div>

          {/* Voting Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 md:gap-12 w-full max-w-5xl">
            {/* Evolve Option */}
            <button
              onClick={() => firstOption?.id && submitVote(firstOption.id)}
              disabled={isSubmitting}
              className="group relative flex flex-col items-center text-center p-10 md:p-12 rounded-2xl border border-white/5 bg-gradient-to-b from-zinc-900/40 to-primary/5 hover:from-zinc-900/60 hover:to-primary/10 hover:border-primary/30 transition-all duration-500 outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative z-10 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
                <Image
                  src="/assets/images/evolve.png"
                  alt="Evolve"
                  width={64}
                  height={64}
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>

              <h2 className="relative z-10 text-3xl md:text-4xl font-subheading font-bold text-white group-hover:text-primary mb-6 tracking-wider uppercase transition-colors duration-300">
                {firstOptionName}
              </h2>

              <p className="relative z-10 font-body text-[12px] md:text-sm leading-relaxed text-white/40 max-w-xs group-hover:text-white/70 transition-colors duration-300">
                {firstOptionDescription}
              </p>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 opacity-50"></div>
            </button>

            {/* Resist Option */}
            <button
              onClick={() => secondOption?.id && submitVote(secondOption.id)}
              disabled={isSubmitting}
              className="group relative flex flex-col items-center text-center p-10 md:p-12 rounded-2xl border border-white/5 bg-gradient-to-b from-zinc-900/40 to-cyan-950/5 hover:from-zinc-900/60 hover:to-cyan-900/10 hover:border-cyan-500/30 transition-all duration-500 outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative z-10 w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <Image
                  src="/assets/images/resist.png"
                  alt="Resist"
                  width={64}
                  height={64}
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>

              <h2 className="relative z-10 text-3xl md:text-4xl font-subheading font-bold text-white group-hover:text-cyan-400 mb-6 tracking-wider uppercase transition-colors duration-300">
                {secondOptionName}
              </h2>

              <p className="relative z-10 font-body text-[12px] md:text-sm leading-relaxed text-white/40 max-w-xs group-hover:text-white/70 transition-colors duration-300">
                {secondOptionDescription}
              </p>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 opacity-50"></div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="font-subheading text-xs md:text-sm uppercase tracking-[0.2em] text-white/30">
              The Fate of the City Hangs on Your Decision
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
