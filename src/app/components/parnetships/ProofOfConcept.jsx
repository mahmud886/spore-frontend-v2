import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const ProofOfConcept = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="relative">
          <div className="absolute"></div>
          <Image
            width={636}
            height={462}
            alt="Spore Fall Visual"
            className="relative rounded-lg w-full h-auto object-cover border border-white/20"
            src="/assets/images/partnerships/proof-of-concept.webp"
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center font-subheading font-display text-[40px] text-primary font-black tracking-widest glow-text">
            SPORE FALL
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="inline-block border border-primary px-3 py-1 text-[10px] font-subheading tracking-[0.2em] text-primary mb-6">
            PROOF OF CONCEPT
          </div>
          <h2 className="font-subheading text-4xl md:text-5xl text-white mb-6 leading-tight tracking-tight">
            OUR FLAGSHIP IP
          </h2>
          <p className="text-gray-400 text-lg mb-10 font-light max-w-lg">
            SPORE FALL IS OUR FIRST PROOF-OF-CONCEPT AND FLAGSHIP NARRATIVE UNIVERSE, DEMONSTRATING OUR ENGINE IN
            ACTION.
          </p>
          <a
            className="inline-flex items-center gap-4 px-8 py-4 bg-primary text-black font-subheading font-bold tracking-widest text-sm rounded-sm hover:bg-white transition-all group"
            href="#"
          >
            EXPLORE THE WORLD OF SPORE FALL
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};
