export default function DiscordCard({ link = "#", description = "Direct link to underground resistance frequency." }) {
  return (
    <div className="mt-8 pt-6 border-t border-white/5 bg-primary/5 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <span className="material-symbols-outlined text-primary text-sm">hub</span>
        <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Comms Node</span>
      </div>
      <p className="text-[11px] text-white/50 mb-4">{description}</p>
      <a
        className="text-[10px] text-primary font-bold uppercase flex items-center hover:translate-x-1 transition-transform"
        href={link}
      >
        Join Discord Terminal <span className="material-symbols-outlined text-sm ml-2">east</span>
      </a>
    </div>
  );
}
