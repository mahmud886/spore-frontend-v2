"use client";

import { X } from "lucide-react";
import Image from "next/image";

export default function PollMiddlePopup({
  phase = "Phase 02: Alignment",
  title = "Shape The Next Chapter of the Story",
  subtitle = "RESIST vs EVOLVE",
  firstOptionName = "EVOLVE",
  secondOptionName = "RESIST",
  firstOptionDescription = "Transcend humanity. Unlock your latent code. Be something more.",
  secondOptionDescription = "Preserve Order. Burn the old world. Rebuild from ashes.",
  onEvolveClick,
  onContainClick,
  onClose,
  showWaitingMessage = true,
}) {
  return (
    <div className="relative w-full max-w-lg">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:border-primary hover:text-black transition-all duration-200 z-20"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {/* Phase label - inside popup */}
        <div className="flex flex-col items-center mb-8">
          <span className="font-display text-[10px] tracking-[0.2em] text-white/50 mb-4 uppercase">{phase}</span>
        </div>
        {/* Decorative blur circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full"></div>

        {/* Traffic light dots */}
        <div className="flex justify-center gap-3 mb-12 -mt-4">
          <div className="w-2.5 h-2.5 rounded-full bg-primary/40"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
        </div>

        {/* Title section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3 uppercase">{title}</h1>
          <p className="font-mono text-sm text-white/50">{subtitle}</p>
        </div>

        {/* Faction cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Evolve button */}
          <button
            onClick={onEvolveClick}
            disabled={!onEvolveClick}
            className="faction-card group relative flex flex-col items-center text-center p-8 rounded-xl border border-white/5 bg-gradient-to-b from-zinc-900/20 to-primary/20 hover:from-zinc-900/30 hover:to-primary/40 hover:border-primary/30 transition-all duration-500 outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Image src="/assets/images/evolve.png" alt="Evolve" width={40} height={40} />
            </div>
            <h2 className="text-2xl font-display font-bold text-primary mb-4 tracking-wider uppercase">
              {firstOptionName}
            </h2>
            <p className="font-mono text-xs leading-relaxed text-white/50 max-w-[180px] whitespace-pre-line">
              {firstOptionDescription}
            </p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-1/2"></div>
          </button>

          {/* Contain button */}
          <button
            onClick={onContainClick}
            disabled={!onContainClick}
            className="faction-card group relative flex flex-col items-center text-center p-8 rounded-xl border border-white/5 bg-gradient-to-b from-zinc-900/20 to-cyan-950/20 hover:from-zinc-900/30 hover:to-cyan-900/40 hover:border-cyan-500/30 transition-all duration-500 outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Image src="/assets/images/resist.png" alt="Resist" width={40} height={40} />
            </div>
            <h2 className="text-2xl font-display font-bold text-cyan-400 mb-4 tracking-wider uppercase">
              {secondOptionName}
            </h2>
            <p className="font-mono text-xs leading-relaxed text-white/50 max-w-[180px] whitespace-pre-line">
              {secondOptionDescription}
            </p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyan-500 transition-all duration-500 group-hover:w-1/2"></div>
          </button>
        </div>

        {/* Footer message */}
        <div className="text-center mt-8">
          <p className="font-mono text-sm uppercase tracking-widest text-white/60">
            The Fate of the City Hangs on Your Decision.
          </p>
        </div>

        {/* Waiting message */}
        {showWaitingMessage && (
          <div className="text-center mt-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 animate-pulse">
              &gt; Waiting for input...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
