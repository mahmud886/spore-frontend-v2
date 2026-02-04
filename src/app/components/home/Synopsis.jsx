export function Synopsis() {
  return (
    <section className="relative pt-[200px] md:pt-[450px] pb-20 overflow-hidden cyber-scanline">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          src="/assets/videos/dustkeeper_1.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" /> */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl md:text-3xl font-subheading text-white leading-relaxed text-center">
            In the fractured city of Lionara where a deadly Spore pathogen outbreak is brutally suppressed by an
            iron-fisted regime, a disillusioned soldier and a rogue medic must bridge their ideological divide when her
            infected brother develops predictive abilities that could accelerate humanity&#39;s evolution or end it.
          </p>
        </div>
        {/* CTA Button */}
        <div className="pt-10 text-center">
          <a
            href="#prologue"
            style={{ borderTopRightRadius: "8px", borderBottomLeftRadius: "8px" }}
            className="inline-block bg-[#C2FF02] font-subheading tracking-widest hover:bg-[#a8db02] text-black text-[24px] md:text-[32px] lg:text-[48px] leading-[28px] font-semibold py-5 px-10 md:py-8 md:px-20 shadow-lg hover:shadow-xl transition-all duration-300 mx-auto cyber-glow-pulse cyber-neon-trail rounded-tr-8 rounded-bl-8"
            aria-label="Jump to prologue"
          >
            Watch Now
          </a>
        </div>
      </div>
    </section>
  );
}
