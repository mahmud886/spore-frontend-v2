export default function AboutSection() {
  return (
    <section className="py-24 px-8 relative">
      <div className="max-w-5xl mx-auto relative group">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-RmhfKPLqFoTAuMa8-BFxfNsdKEtkHaVNsn0eGe0fcaUZSBXDszDU0e99LEVhY3aNPUNgtouPD4s4ExxmXnBUeNCZzIt80qHlLdlS4s0Za5SklX1N6uzNHFuQwni4O2gu7rZ9cnB52z4FwYRIfJiTZl6NOJCF_9YqDek-ePj8ZhjWhbXhepK7xfJtu1MGYdXR-YPvfL_PgOgA0g493p9PVC7CfnuWLRifj70MROke7wJbvrV7XP_ZWNQUdW_3VydYLyZ3zghRAoY')",
          }}
        ></div>
        <div className="absolute inset-0 "></div>
        <div className="relative z-10 border border-terminal-border p-12 md:p-20 text-center space-y-8">
          <div className="absolute top-0 left-0 w-10 h-10 border-t-[3px] border-l-[3px] border-primary z-20"></div>
          <div className="absolute top-0 right-0 w-10 h-10 border-t-[3px] border-r-[3px] border-primary z-20"></div>
          <div className="absolute -bottom-8 left-0 w-10 h-10 border-b-[3px] border-l-[3px] border-primary z-20"></div>
          <div className="absolute -bottom-8 right-0 w-10 h-10 border-b-[3px] border-r-[3px] border-primary z-20 pointer-events-none"></div>
          <h2 className="text-4xl font-display font-bold tracking-widest text-primary uppercase">About</h2>
          <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed italic max-w-3xl mx-auto">
            In the fractured city of Lionara where a deadly Spore pathogen outbreak is brutally suppressed by an
            iron-fisted regime, a disillusioned soldier and a rogue medic must bridge their ideological divide when her
            infected brother develops predictive abilities that could accelerate humanity's evolution or end it.
          </p>
          <button className="bg-primary text-black px-10 py-3 font-display font-bold uppercase text-sm hover:brightness-110 transition-all inline-flex items-center gap-2 border-glow">
            Know More <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
