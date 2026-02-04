import Image from "next/image";

const PartnershipsHeader = () => {
  return (
    <>
      <section className="pt-24 pb-12 md:pt-40 md:pb-20 relative overflow-hidden hero-gradient">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h1 className="font-display  text-[30px] md:text-[80px] lg:text-[80px] font-heading font-bold tracking-wider text-primary  glow-text">
            SPORE FALL
            <br />
            CHRONICLES
          </h1>
          <div className="flex flex-col items-center">
            <Image
              alt="Edenstone Logo"
              className="w-[174px] h-[174px] opacity-80"
              width={174}
              height={174}
              src="/assets/images/partnerships/edenstone.webp"
            />
            <p className="text-lg md:text-[24px] max-w-2xl font-body mx-auto font-light leading-relaxed mb-4">
              is a multi-platform narrative universe and
              <br />
              the flagship intellectual property of <span className="text-primary font-semibold">Edenstone Group.</span>
            </p>
            <p className="text-sm text-gray-400 font-body max-w-xl mx-auto">
              Forged through years of brand storytelling for global giants, Edenstone now focus exclusively on building
              scalable intellectual property for the global entertainment landscape.
            </p>
          </div>
          <div className="mt-10 font-subheading flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              className="leading-wider  px-8 py-4 bg-primary text-black font-display font-bold tracking-widest text-[20px] md:text-[28px] rounded-sm hover:bg-primary/90 transition-colors duration-300"
              href="#"
            >
              EXPLORE SPORE FALL
            </a>
            <a
              className="leading-wider  px-8 py-4 border-2 border-primary text-primary font-display font-bold tracking-widest text-[20px] md:text-[27px] rounded-sm hover:bg-primary hover:text-black transition-all duration-300"
              href="#"
            >
              EXPLORE PROJECTS
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default PartnershipsHeader;
