import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const InvestorsAndPartners = () => {
  return (
    <section className="py-12 md:py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-12">
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute"></div>
          <Image
            width={523}
            height={380}
            alt="Futuristic Handshake"
            className="relative rounded-lg w-full h-auto object-cover border border-white/20"
            src="/assets/images/partnerships/investors-partners.webp"
          />
        </div>
        <div className="lg:w-1/2">
          <h2 className="font-subheading text-4xl md:text-5xl text-white mb-6 leading-tight tracking-widest">
            INVESTORS &amp; PARTNERS
          </h2>
          <p className="text-gray-400 text-lg mb-10 font-body font-light max-w-lg">
            Edenstone represents a scalable IP origination and development platform. Our proprietary methodology—from
            AI-world building to community-enabled co-creation—de-risks IP development and creates multiple valuation
            levers.
          </p>
          <a
            className="inline-flex justify-center text-center items-center gap-4 px-8 py-4 bg-primary text-black font-subheading font-bold tracking-widest text-sm rounded-sm hover:bg-white transition-all group"
            href="mailto:partners@edenstone.group"
          >
            CONTACT FOR DEAL FLOW
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};
