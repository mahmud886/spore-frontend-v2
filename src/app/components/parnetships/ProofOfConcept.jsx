import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const ProofOfConcept = () => {
  return (
    <section className="py-12 md:py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="relative w-full lg:w-auto">
          <div className="absolute"></div>
          <Image
            width={636}
            height={462}
            alt="Spore Fall: Flagship Narrative Universe and Proof of Concept"
            className="relative rounded-lg w-full h-full object-cover border border-white/20"
            src="/assets/images/partnerships/proof-of-concept.webp"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-subheading font-display text-[40px] text-primary font-black tracking-widest glow-text w-full px-4">
            SPORE FALL
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="inline-block border border-primary px-3 py-1 text-[10px] font-subheading tracking-[0.2em] text-primary mb-6">
            PROOF OF CONCEPT
          </div>
          <h2 className="font-subheading text-4xl md:text-5xl text-white mb-6 leading-tight tracking-widest">
            OUR FLAGSHIP IP
          </h2>
          <p className="text-gray-400 text-lg mb-10 font-light max-w-lg">
            SPORE FALL IS OUR FIRST PROOF-OF-CONCEPT AND FLAGSHIP NARRATIVE UNIVERSE, DEMONSTRATING OUR ENGINE IN
            ACTION.
          </p>
          <Link
            className="inline-flex justify-center text-center items-center gap-4 px-8 py-4 bg-primary text-black font-subheading font-bold tracking-widest text-sm rounded-sm hover:bg-primary/90 transition-all group"
            href="/"
            aria-label="Explore the world of Spore Fall"
            target="_blank"
          >
            EXPLORE THE WORLD OF SPORE FALL
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-16 text-center border-white/10">
        <h2 className="font-subheading text-4xl md:text-5xl text-white mb-8 leading-tight tracking-widest uppercase">
          Future of Media Franchises: Immersive, tech-augmented & globally scalable
        </h2>
        <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed">
          <p>
            Throughout history, legacy IPs have defined their mediums: Star Wars for film, Harry Potter for literature,
            capturing imaginations through a single screen or page.
          </p>
          <p>
            The future of storytelling is immersive, interactive, and expansive. Audiences today crave worlds they can
            step into.
          </p>
          <p className="text-primary">
            Edenstone is built to meet a new age of immersive, tech-augmented storytelling.
          </p>
          <p className="text-primary font-subheading text-xl tracking-widest">
            We are created in Singapore for the world.
          </p>
        </div>
      </div>
    </section>
  );
};
