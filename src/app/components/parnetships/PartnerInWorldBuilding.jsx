import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";

export const PartnerInWorldBuilding = () => {
  return (
    <section className="py-12 md:py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-black/50 border border-primary/30 rounded-2xl overflow-hidden">
          <Image
            width={600}
            height={276}
            alt="World Building Header"
            className="w-full h-auto min-h-[256px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
            src="/assets/images/partnerships/partner-in-word-build.webp"
          />
          <div className="p-10">
            <h3 className="font-subheading text-2xl text-primary mb-6">Partner With Us to Build & Scale New Worlds</h3>
            <p className="text-gray-300 mb-8 font-light">
              Explore investment opportunities in our IP pipeline and studio engine:
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm text-gray-200">
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                Diversified revenue streams
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-200">
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                Scalable platforms and markets
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-200">
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                Learn how our proprietary model de-risks and scales narrative IP
              </li>
            </ul>
            <a
              className="inline-flex items-center gap-4 px-8 py-4 bg-primary text-black font-subheading font-bold tracking-widest text-[10px] md:text-sm rounded-sm hover:bg-white transition-all group"
              href="#"
            >
              SCHEDULE FOR A BRIEF
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
