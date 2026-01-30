"use client";

import DiscordCard from "../DiscordCard";

export default function TacticalDirective({
  title = "Tactical Directive",
  description,
  buttonText = "Decide the Future",
  onButtonClick,
  showDiscordCard = true,
  discordLink = "#",
  discordDescription = "Direct link to underground resistance frequency.",
}) {
  // Default description with highlighted words
  const defaultDescription = (
    <>
      The containment walls are <span className="bg-primary/20 px-1 text-primary">compromised</span>. Your broadcast
      signal is currently boosting the <span className="text-primary">Evolution</span> frequency by 0.12%. Maintain
      position and continue transmission.
    </>
  );

  return (
    <div className="space-y-6">
      <div className="bg-terminal-gray/20 border border-white/5 p-6 h-full flex flex-col">
        <h4 className="text-[10px] text-primary font-bold tracking-[0.2em] mb-4 uppercase border-b border-primary/20 pb-2">
          {title}
        </h4>
        <p className="text-sm text-white/60 leading-relaxed mb-8 italic">{description || defaultDescription}</p>
        <button
          className="w-full bg-white/5 border border-white/10 text-white/80 py-3 text-xs font-bold uppercase hover:bg-white/10 transition-colors mb-auto"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
        {showDiscordCard && <DiscordCard link={discordLink} description={discordDescription} />}
      </div>
    </div>
  );
}
