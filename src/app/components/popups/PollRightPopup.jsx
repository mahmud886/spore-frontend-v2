"use client";

import { BadgeCheck, Microscope, Play, ShieldCheck, UserCheck, X } from "lucide-react";
import { useState } from "react";

export default function PollRightPopup({
  phase = "PHASE 03: PROCESSING",
  designation = "SPECTRE_01",
  faction = "Evolve",
  factionIcon = "microscope",
  onClose,
  onEmailSubmit,
  onClaimBadge,
  show = true,
}) {
  const [email, setEmail] = useState("");

  if (!show) return null;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (onEmailSubmit) {
      onEmailSubmit(email);
    }
  };

  const handleClaimBadge = () => {
    if (onClaimBadge) {
      onClaimBadge();
    }
  };

  return (
    <>
      {/* Grid background overlay */}
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-50"></div>

      {/* Main popup */}
      <div className="relative w-full max-w-lg bg-black border border-white/10 rounded-2xl shadow-2xl z-10 p-6 md:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:border-primary hover:text-black transition-all duration-200 z-20"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <span className="font-display text-[10px] tracking-[0.2em] text-white/50 mb-4">{phase}</span>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-800"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800"></div>
            <div className="w-2 h-2 rounded-full bg-primary glow-dot"></div>
          </div>
        </div>

        {/* Terminal status messages */}
        <div className="bg-terminal-gray border border-white/5 rounded-lg p-5 mb-6 font-display text-xs leading-relaxed">
          <div className="text-primary opacity-90">&gt; CONNECTING TO SPOREFALL MAINNET...</div>
          <div className="text-primary opacity-90">&gt; VERIFYING DNA SEQUENCE... OK</div>
          <div className="text-primary opacity-90">&gt; ALLIANCE: {faction.toUpperCase()} FACTION CONFIRMED</div>
          <div className="text-primary">&gt; MINTING IDENTITY BADGE [##########]</div>
          <div className="text-white/40">
            &gt; READY FOR CLAIM
            <span className="inline-block w-2 h-4 bg-primary align-middle ml-1 animate-terminal-cursor"></span>
          </div>
        </div>

        {/* Identity badge card */}
        <div className="card-gradient border border-white/5 rounded-xl p-5 mb-8 flex items-center gap-5 shadow-inner">
          <div className="w-16 h-16 bg-black border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <BadgeCheck className="w-10 h-10 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-display text-white/50 tracking-wider">DESIGNATION</span>
            <span className="text-2xl font-display font-bold text-white tracking-tight mb-2">{designation}</span>
            <div className="inline-flex items-center bg-primary px-2 py-0.5 rounded gap-1 w-fit">
              {(() => {
                const Icon =
                  factionIcon === "microscope"
                    ? Microscope
                    : factionIcon === "shield"
                      ? ShieldCheck
                      : factionIcon === "user"
                        ? UserCheck
                        : BadgeCheck;
                return <Icon className="w-4 h-4 text-black" />;
              })()}
              <span className="text-[10px] font-display font-bold text-black uppercase">{faction}</span>
            </div>
          </div>
        </div>

        {/* Email input section */}
        <div className="mb-6">
          <label className="block font-display text-[10px] text-white/50 tracking-widest mb-2 px-1">
            SEND TRANSMISSION TO
          </label>
          <form onSubmit={handleEmailSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              className="flex-grow bg-black border border-white/10 rounded-lg px-4 py-3 font-display text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-white placeholder-white/20 transition-all"
              placeholder="OPERATIVE@EMAIL.COM"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-[#b8e600] text-black w-14 flex items-center justify-center rounded-lg transition-all active:scale-95 shadow-lg shadow-primary/10"
            >
              <Play className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Claim badge button */}
        <button
          onClick={handleClaimBadge}
          className="w-full border-2 border-primary/40 hover:border-primary hover:bg-primary/5 text-primary font-display font-bold py-4 rounded-xl tracking-[0.15em] transition-all duration-300 uppercase text-sm group"
        >
          <span className="group-hover:tracking-[0.25em] transition-all duration-300">Claim Badge Asset</span>
        </button>
      </div>

      {/* Bottom blur effect */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-0"></div>
    </>
  );
}
