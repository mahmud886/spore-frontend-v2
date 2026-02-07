"use client";

import Image from "next/image";

export const SupportHeader = () => {
  const handleScrollToDonate = () => {
    const element = document.getElementById("support-universe");
    if (element) {
      const offset = 100; // Account for sticky navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setTimeout(() => {
        const input = document.getElementById("donate-custom-amount");
        if (input) {
          input.focus({ preventScroll: true });
        }
      }, 500);
    }
  };

  return (
    <>
      <section className="max-w-4xl mx-auto text-center mb-14 px-5">
        <div className="mb-10 flex justify-center mt-16">
          <div className="relative w-[300px] h-[300px] rounded-full p-[2px] ">
            <Image
              width={141}
              height={141}
              alt="Creator Profile"
              className="w-[300px] h-[300px] rounded-full object-cover"
              src="/assets/images/support-us/support-image.webp"
            />
          </div>
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-normal text-primary mb-10 tracking-tight neon-text uppercase">
          A NOTE FROM THE CREATOR:
        </h1>
        <div className="space-y-4 text-gray-300 leading-relaxed font-light text-[12px] md:text-base font-body">
          <p className="text-center text-[16px]">
            Season 1 was our first step into the world of Spore Fall. The success is yours—thank you to every viewer,
            supporter, and friend who brought it to life. To our amazing community: Your support and belief made this
            universe real. Now, the real work begins.
          </p>
          <br />
          <h2 className="font-subheading text-lg md:text-[24px] font-bold mb-10 tracking-widest text-yellow-300 uppercase leading-normal">
            &quot;Your contribution directly funds seasons 2 & 3, unlocking our path to a feature length theatrical
            release in movie theatres.&quot;
          </h2>
          <p className="text-center text-[16px] max-w-[80%] mx-auto">
            Our immediate mission: complete Seasons 2 and 3—the final chapters of our micro-drama trilogy. And after? We
            want to put a movie on the big screens. This is our collective leap from micro-drama to macro-legacy.
          </p>
        </div>
      </section>
      <section className="text-center mb-30 px-5">
        <h2 className="font-subheading text-lg md:text-[36px] font-bold mb-14 tracking-widest text-yellow-300 uppercase leading-normal ">
          &quot;The Spore Fall Universe needs a heartbeat, <br />
          will you be our driving pulse?&quot;
        </h2>
        <div className="space-y-12">
          <h3 className="font-heading text-sm md:text-3xl font-normal text-primary mb-10 tracking-tight neon-text uppercase">
            The City Has Fallen...
          </h3>
          <div className="max-w-2xl mx-auto">
            <h4 className="font-subheading text-sm text-[30px] mb-6 text-white tracking-normal font-normal uppercase">
              THE MISSION:
            </h4>
            <p className="text-gray-400 text-sm md:text-lg leading-relaxed font-light font-body">
              You hold the key. Fund Seasons 2 &amp; 3 to expand the universe. Join our Inner Circle as a Founding
              Member and co-create the future of the{" "}
              <span className="text-primary font-bold">Spore Fall Chronicles.</span>
            </p>
          </div>
          <div className="pt-8">
            <button
              onClick={handleScrollToDonate}
              className="cursor-pointer bg-primary text-black font-subheading font-black text-xl px-16 py-4 rounded-sm hover:scale-105 transition-transform duration-300 uppercase tracking-widest shadow-[0_0_30px_rgba(204,255,0,0.3)]"
            >
              Donate Any Amount
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
