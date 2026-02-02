"use client";

import { Dna, Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function PollAdModal({
  isOpen,
  onClose,
  onOpen,
  episodeId,
  pollData,
  onVoteSuccess,
  inline = false,
  inlineAlign = "end",
  showBubbleWhenClosed = true,
  showClose = true,
  designVariant = "ad",
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (typeof window === "undefined" || !pollData) return null;

  const options = Array.isArray(pollData.options) ? pollData.options : [];
  const firstOption = options[0];
  const secondOption = options[1];

  const submitVote = async (optionId) => {
    if (isSubmitting) return;
    if (!episodeId || !optionId) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/polls/episode/${encodeURIComponent(episodeId)}/vote`, {
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
        const eidStr = String(episodeId);
        const votedStr = votedEpisodes.map((id) => String(id));
        if (!votedStr.includes(eidStr)) {
          votedEpisodes.push(episodeId);
          localStorage.setItem("sporefall_voted_episodes", JSON.stringify(votedEpisodes));
        }
      } catch {}
      if (onVoteSuccess) onVoteSuccess(episodeId);
      if (onClose) onClose();
      setTimeout(() => {
        const url = `/result?episode=${encodeURIComponent(episodeId)}`;
        router.push(url);
      }, 100);
    } catch {
      setIsSubmitting(false);
    }
  };

  if (inline && designVariant === "middle") {
    if (!isOpen) return null;
    const firstOptionName = firstOption?.name || firstOption?.text || "EVOLVE";
    const secondOptionName = secondOption?.name || secondOption?.text || "RESIST";
    const firstOptionDescription =
      firstOption?.description || "Transcend humanity. Unlock your latent code. Be something more.";
    const secondOptionDescription =
      secondOption?.description || "Preserve Order. Burn the old world. Rebuild from ashes.";
    const justify =
      inlineAlign === "center" ? "justify-center" : inlineAlign === "start" ? "justify-start" : "justify-end";
    return (
      <div className={`w-full flex ${justify} mt-8 mb-12`}>
        <div className="relative w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
          <div className="flex flex-col items-center mb-6">
            <span className="font-display text-[10px] tracking-[0.2em] text-white/50 uppercase">
              {pollData.title || "Phase 02: Alignment"}
            </span>
          </div>
          <div className="flex justify-center gap-3 mb-10 -mt-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
          </div>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3 uppercase">
              {pollData.question || pollData.description || "Shape The Next Chapter of the Story"}
            </h1>
            <p className="font-mono text-sm text-white/50">
              {options.length > 0
                ? options
                    .map((opt) => opt?.name || opt?.text || "")
                    .filter(Boolean)
                    .join(" vs ")
                : "RESIST vs EVOLVE"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <button
              disabled={isSubmitting || !firstOption?.id}
              onClick={() => submitVote(firstOption.id)}
              className="group relative flex flex-col items-center text-center p-8 rounded-xl border border-white/5 bg-gradient-to-b from-zinc-900/20 to-primary/20 hover:from-zinc-900/30 hover:to-primary/40 hover:border-primary/30 transition-all duration-500 outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Dna className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-primary mb-4 tracking-wider uppercase">
                {firstOptionName}
              </h2>
              <p className="font-mono text-sm text-white/60">{firstOptionDescription}</p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-1/2"></div>
            </button>
            <button
              disabled={isSubmitting || !secondOption?.id}
              onClick={() => submitVote(secondOption.id)}
              className="group relative flex flex-col items-center text-center p-8 rounded-xl border border-white/5 bg-gradient-to-b from-zinc-900/20 to-cyan-950/20 hover:from-zinc-900/30 hover:to-cyan-900/40 hover:border-cyan-500/30 transition-all duration-500 outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-display font-bold text-cyan-400 mb-4 tracking-wider uppercase">
                {secondOptionName}
              </h2>
              <p className="font-mono text-sm text-white/60">{secondOptionDescription}</p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyan-500 transition-all duration-500 group-hover:w-1/2"></div>
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="font-mono text-sm uppercase tracking-widest text-white/60">
              The Fate of the City Hangs on Your Decision.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const panelContent = (
    <div
      className={
        inline
          ? "relative w-[560px] sm:w-[640px] md:w-[720px] max-h-[70vh] bg-black/60 border border-white/10 p-6 rounded-xl shadow-2xl overflow-y-auto"
          : "pointer-events-auto relative w-[280px] sm:w-[300px] max-h-[70vh] bg-black/60 border border-white/10 p-4 rounded-xl shadow-2xl overflow-y-auto"
      }
    >
      {showClose && (
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:border-primary hover:text-black transition-all duration-200"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="mb-4">
        <span className="font-display text-[10px] tracking-[0.2em] text-white/50 uppercase">
          {pollData.title || "Poll"}
        </span>
        <h2 className="mt-2 text-xl font-display font-bold uppercase">{pollData.question || "Make your choice"}</h2>
        <p className="mt-1 font-mono text-[11px] text-white/60">
          {pollData.description || "Shape The Next Chapter of the Story"}
        </p>
      </div>

      <div className="space-y-4">
        {firstOption && (
          <button
            disabled={isSubmitting}
            onClick={() => submitVote(firstOption.id)}
            className="w-full text-left p-3 rounded-lg border border-primary/40 bg-linear-to-br from-zinc-900/30 to-primary/20 hover:to-primary/40 hover:border-primary transition-all"
          >
            <div className="text-[13px] font-bold text-primary uppercase">
              {firstOption.name || firstOption.text || "EVOLVE"}
            </div>
            {firstOption.description && (
              <div className="mt-1 font-mono text-[10px] text-white/60">{firstOption.description}</div>
            )}
          </button>
        )}
        {secondOption && (
          <button
            disabled={isSubmitting}
            onClick={() => submitVote(secondOption.id)}
            className="w-full text-left p-3 rounded-lg border border-cyan-500/40 bg-linear-to-br from-zinc-900/30 to-cyan-950/20 hover:to-cyan-900/40 hover:border-cyan-500 transition-all"
          >
            <div className="text-[13px] font-bold text-cyan-400 uppercase">
              {secondOption.name || secondOption.text || "RESIST"}
            </div>
            {secondOption.description && (
              <div className="mt-1 font-mono text-[10px] text-white/60">{secondOption.description}</div>
            )}
          </button>
        )}
      </div>

      <div className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">&gt; Ad Panel</p>
      </div>
    </div>
  );

  if (inline) {
    if (isOpen) {
      const justify =
        inlineAlign === "center" ? "justify-center" : inlineAlign === "start" ? "justify-start" : "justify-end";
      return <div className={`w-full flex ${justify} mt-8 mb-12`}>{panelContent}</div>;
    }
    return null;
  }

  if (isOpen) {
    const adPanel = (
      <div className="fixed inset-0 pointer-events-none flex items-center justify-end z-[100]">{panelContent}</div>
    );
    return createPortal(adPanel, document.body);
  }

  if (showBubbleWhenClosed) {
    const bubble = (
      <div className="fixed inset-0 pointer-events-none flex items-center justify-end z-[100]">
        <button
          type="button"
          className="pointer-events-auto mr-4 w-12 h-12 rounded-full border border-white/20 bg-black/50 text-white/80 backdrop-blur-md shadow-xl hover:bg-primary hover:text-black transition-all duration-200 flex items-center justify-center"
          onClick={onOpen}
          aria-label="Open Poll"
          title="Open Poll"
        >
          <span className="text-[10px] font-display tracking-wider uppercase">Poll</span>
        </button>
      </div>
    );
    return createPortal(bubble, document.body);
  }

  return null;
}
