import Image from "next/image";

export const SupportHeader = () => {
  return (
    <>
      <section className="max-w-4xl mx-auto text-center mb-32">
        <div className="mb-10 flex justify-center mt-16">
          <div className="relative w-28 h-28 rounded-full p-[2px] ">
            <Image
              width={141}
              height={141}
              alt="Creator Profile"
              className="w-full h-full rounded-full border-[3px] border-black object-cover shadow-2xl"
              src="/assets/images/support-us/support-us-logo.png"
            />
          </div>
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-normal text-primary mb-10 tracking-tight neon-text uppercase">
          A NOTE FROM THE CREATOR:
        </h1>
        <div className="space-y-6 text-gray-300 leading-relaxed font-light text-sm md:text-base font-body">
          <p>
            Season 1 was our first step into the world of Spore Fall. The success is yours—thank you to every viewer,
            supporter, and friend who brought it to life. To our amazing community: Your support and belief made this
            universe real.
          </p>
          <p>
            Now, the real work begins. Our immediate mission is to complete Seasons 2 and 3—the final chapters of our
            micro-drama trilogy. And after? We want to put a movie on the big screens. We are crowdfunding the next
            Seasons to expand the universe and construct the launchpad for a full-length feature film. This is our
            collective leap from micro-drama to macro-legacy.
          </p>
        </div>
      </section>
      <section className="text-center mb-40">
        <h2 className="font-subheading text-lg md:text-[36px] font-bold mb-20 tracking-normal text-white uppercase leading-normal">
          &quot;THE SPORE FALL UNIVERSE NEEDS A HEARTBEAT, <br className="hidden md:block" />
          WILL YOU BE OUR DRIVING PULSE?&quot;
        </h2>
        <div className="mt-24 space-y-12">
          <h3 className="font-heading text-4xl md:text-[48px] font-black text-primary tracking-normal uppercase leading-normal neon-text">
            THE CITY HAS FALLEN BUT <br />
            THE STORY MUST CONTINUE
          </h3>
          <div className="max-w-2xl mx-auto">
            <h4 className="font-subheading text-[48px] mb-6 text-white tracking-normal font-normal uppercase">
              THE MISSION:
            </h4>
            <p className="text-gray-400 text-sm md:text-lg leading-relaxed font-light font-body">
              You hold the key. Fund Seasons 2 &amp; 3 to expand the universe. Join our Inner Circle as a Founding
              Member and co-create the future of the{" "}
              <span className="text-primary font-bold">Spore Fall Chronicles.</span>
            </p>
          </div>
          <div className="pt-8">
            <button className="bg-primary text-black font-heading font-black text-xl px-16 py-4 rounded-sm hover:scale-105 transition-transform duration-300 uppercase tracking-widest shadow-[0_0_30px_rgba(204,255,0,0.3)]">
              JOIN US
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
