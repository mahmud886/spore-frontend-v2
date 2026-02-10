import LazyBackgroundVideo from "../shared/LazyBackgroundVideo";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-full h-full">
          <LazyBackgroundVideo
            className="w-full h-full object-cover"
            sources={[
              { src: "/assets/videos/infection_WIDE_2.webm", type: "video/webm" },
              { src: "/assets/videos/infection_WIDE_2.mp4", type: "video/mp4" },
            ]}
            poster="/assets/images/hero-image.webp"
            preload="none"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center cyber-holographic cyber-data-stream">
        <div className="mx-auto space-y-4 md:space-y-8">
          <h1 className="mb-12 md:mb-[160px] text-[42px] md:text-[80px] lg:text-[80px] font-heading font-bold tracking-wider text-white uppercase cyber-glow-blink">
            Spore Fall
          </h1>
          <p className="text-[18px] md:text-[42px] lg:text-[42px] font-subheading text-gray-300 max-w-3xl mx-auto leading-tight">
            Humanity’s final Journey to <br /> the Brink Of Evolution
          </p>
          <div className="pt-4">
            <a
              href="#prologue"
              aria-label="Jump to prologue"
              style={{ borderTopRightRadius: "8px", borderBottomLeftRadius: "8px" }}
              className="inline-block bg-[#C2FF02] font-subheading tracking-widest hover:bg-[#a8db02] text-black text-[24px] md:text-[32px] lg:text-[48px] leading-[28px] font-semibold py-5 px-10 md:py-8 md:px-20 shadow-lg hover:shadow-xl transition-all duration-300  mx-auto cyber-glow-pulse cyber-neon-trail rounded-tr-8 rounded-bl-8"
            >
              Watch Now
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
