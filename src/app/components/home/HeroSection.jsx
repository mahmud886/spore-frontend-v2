import LazyBackgroundVideo from "../shared/LazyBackgroundVideo";

export default function HeroSection() {
  return (
    // <section className="min-h-screen flex flex-col md:flex-row items-center px-8  py-20 relative overflow-hidden">
    //   <div className="fixed inset-0 grid-overlay pointer-events-none opacity-40"></div>
    //   <div className="fixed inset-0 pointer-events-none overflow-hidden">
    //     <div className="scanline"></div>
    //   </div>
    //   <div className="flex-1 space-y-8 relative z-10">
    //     <div className="space-y-2">
    //       <p className="text-[10px] text-primary/60 tracking-widest font-mono uppercase">/// Incoming Transmission</p>
    //       <p className="text-[10px] text-primary/60 tracking-widest font-mono uppercase">Loc: Lionara Sector 4</p>
    //     </div>
    //     <div className="relative inline-block">
    //       <h1 className="text-7xl md:text-9xl font-display font-subheading font-black leading-none text-primary uppercase text-glow">
    //         SPORE
    //         <br />
    //         FALL
    //       </h1>
    //       <div className="absolute -right-4 top-0 border border-primary px-2 py-0.5 text-[8px] text-primary tracking-widest uppercase">
    //         The Event
    //       </div>
    //     </div>
    //     <p className="max-w-md text-white/70 leading-relaxed border-l-2 border-primary/30 pl-6 py-2">
    //       The city of Lionara is quarantined. A spore is rewriting human fate. The walls won't hold forever.
    //     </p>
    //     <div className="flex flex-wrap gap-6 pt-4">
    //       <button className="bg-primary text-black px-8 py-3 flex items-center gap-3 font-display font-bold hover:brightness-110 transition-all uppercase text-sm">
    //         <span className="material-symbols-outlined text-lg">play_arrow</span>
    //         Watch Episode
    //       </button>
    //       <button className="border border-primary/40 text-primary px-8 py-3 flex items-center gap-3 font-display font-bold hover:bg-primary/10 transition-all uppercase text-sm">
    //         Cast Your Vote
    //         <span className="material-symbols-outlined text-lg">arrow_forward</span>
    //       </button>
    //     </div>
    //     <div className="pt-10">
    //       <a
    //         className="text-[10px] text-primary/50 hover:text-primary transition-colors tracking-widest uppercase underline underline-offset-4"
    //         href="#"
    //       >
    //         See Design Version 2 &gt;&gt;&gt;
    //       </a>
    //     </div>
    //   </div>
    //   <div className="flex-1 flex justify-end mt-20 md:mt-0 relative z-10">
    //     <div className="relative p-1 border border-primary/20 bg-background-dark/50 group">
    //       <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-primary pointer-events-none"></div>
    //       <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-primary pointer-events-none"></div>
    //       <div className="relative w-[300px] h-[450px] overflow-hidden">
    //         <Image
    //           alt="Cinematic hallway preview"
    //           className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
    //           src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm1YFDZ5B1hE5PovDjJ5REaCC58bLc3hfhk3QL3FT6CNjqpVNAEeb8UL1EOOBU-Jcv1VWl1HZZ4kDphizOXpSQAltBhS0uyCPQgZmwkodgTnsnVCDJz9MNfieF0DlTBDp0K5MisV_Z_LQQspXwjU3QqmdCKiEMpI1y4gAPEEW3jO7u4IYy8EA7XkyIFB6n8iKQt79_ny_ivkUXEKnXvMJ4OwBi3N7RaYSlMJooVYGh2aBdvH-ZoqJlc8OILHnUU95UG3_SMXb0yNY"
    //           width={300}
    //           height={450}
    //           unoptimized
    //         />
    //         <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
    //         <div className="absolute inset-0 flex items-center justify-center">
    //           <button className="w-16 h-16 rounded-full border-2 border-primary/50 flex items-center justify-center text-primary bg-black/40 backdrop-blur-sm group-hover:scale-110 transition-all">
    //             <span className="material-symbols-outlined text-4xl">play_circle</span>
    //           </button>
    //         </div>
    //         <div className="absolute bottom-6 left-6 right-6">
    //           <p className="text-[10px] text-primary uppercase font-display mb-1">Episode 01</p>
    //           <h3 className="text-xl font-display font-bold uppercase tracking-wide">The Outbreak</h3>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
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
              href="#episodes"
              style={{ borderTopRightRadius: "8px", borderBottomLeftRadius: "8px" }}
              className="inline-block bg-[#C2FF02] font-subheading tracking-widest hover:bg-[#a8db02] text-black text-[24px] md:text-[32px] lg:text-[48px] leading-[28px] font-semibold py-5 px-10 md:py-8 md:px-20 shadow-lg hover:shadow-xl transition-all duration-300  mx-auto cyber-glow-pulse cyber-neon-trail rounded-tr-8 rounded-bl-8"
            >
              Season 1
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
