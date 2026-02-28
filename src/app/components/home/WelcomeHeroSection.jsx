import Link from "next/link";
import LazyBackgroundVideo from "../shared/LazyBackgroundVideo";

export default function WelcomeHeroSection() {
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-zinc-950" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-8 text-center cyber-holographic cyber-data-stream">
        <div className="mx-auto space-y-3 md:space-y-4">
          <h1 className="mb-4 md:mb-6 text-[28px] md:text-[48px] font-heading font-bold tracking-wider text-white uppercase cyber-glow-blink">
            Spore Fall
          </h1>
          <p className="text-[14px] md:text-[20px] font-subheading text-gray-300 max-w-xl mx-auto leading-tight">
            Humanity’s final Journey to <br /> the Brink Of Evolution
          </p>
          <div className="pt-2">
            <Link
              href="/#prologue"
              aria-label="Watch prologue on home page"
              style={{ borderTopRightRadius: "8px", borderBottomLeftRadius: "8px" }}
              className="inline-block bg-[#C2FF02] font-subheading tracking-widest hover:bg-[#a8db02] text-black text-[18px] md:text-[24px] leading-none font-semibold py-4 px-8 md:py-6 md:px-12 shadow-lg hover:shadow-xl transition-all duration-300 mx-auto cyber-glow-pulse cyber-neon-trail"
            >
              Watch Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
