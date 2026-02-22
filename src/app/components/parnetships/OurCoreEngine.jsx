import Image from "next/image";

const CORE_ENGINE_DATA = [
  {
    title: "AI-Powered World Building",
    description:
      "We craft rich, detailed universes using AI tools to create coherent lore, complex ecosystems, and evolving storylines—as seen in Spore Fall.",
    image: "/assets/images/partnerships/core-engine1.webp",
    alt: "Edenstone Core Engine: AI-Powered World Building",
  },
  {
    title: "Transmedia Development",
    description:
      "We engineer narratives to unfold as interconnected experiences across digital, physical, and interactive platforms. Whether a film, an (AR) augmented reality activation, or a digital collectible, each serves as a unique entry point into a deeper experience.",
    image: "/assets/images/partnerships/core-engine2.webp",
    alt: "Edenstone Core Engine: Transmedia Development",
  },
  {
    title: "Community & Audience Co-Creation:",
    description:
      "A story universe needs a heartbeat. Web 3.0 is our connective pulse, bridging narrative, community, and engagement. By leveraging Web 3.0 tools—from digital ownership to interactive protocols—we empower fandom to actively participate in and help shape the unfolding saga, transforming viewers into vested co-authors.",
    image: "/assets/images/partnerships/core-engine3.webp",
    alt: "Edenstone Core Engine: Web3 Community Co-Creation",
  },
];

export const OurCoreEngine = () => {
  return (
    <section className="py-12 md:py-24 px-6 bg-black/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-subheading md:text-[56px] text-primary mb-4 tracking-widest glow-text">
            OUR CORE ENGINE
          </h2>
          <p className="text-gray-400 font-body text-xs tracking-widest uppercase">
            WE LEVERAGE AI AND WEB 3.0 TO ARCHITECT IMMERSIVE STORY WORLDS
            <br />
            USING A PROPRIETARY TECH-AUGMENTED ENGINE.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CORE_ENGINE_DATA.map((item, index) => (
            <div key={index} className="bg-zinc-900/50 border border-primary/10 rounded-xl overflow-hidden card-hover">
              <Image
                width={395}
                height={220}
                alt={item.alt}
                className="w-full h-50 object-cover opacity-70"
                src={item.image}
              />
              <div className="p-6">
                <h3 className="font-display text-[20px] text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 font-body text-[14px] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
