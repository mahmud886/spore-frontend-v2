"use client";

import { motion } from "framer-motion";
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

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const flickerAnimation = {
    opacity: [1, 0.9, 1, 0.8, 1],
    filter: ["brightness(1)", "brightness(1.1)", "brightness(1)", "brightness(1.2)", "brightness(1)"],
    transition: {
      duration: 3,
      repeat: Infinity,
      times: [0, 0.2, 0.4, 0.6, 1],
    },
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-14 px-5"
      >
        <div className="mb-10 flex justify-center mt-16">
          <div className="relative w-[300px] h-[300px] rounded-full p-[2px] ">
            <Image
              width={141}
              height={141}
              alt="Spore Fall Creator Profile - A Message from the Team"
              className="w-[300px] h-[300px] rounded-full object-cover"
              src="/assets/images/support-us/support-image.webp"
            />
            {/* Pulsing ring around profile */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-4 border-2 border-white/20 rounded-full pointer-events-none"
            />
          </div>
        </div>
        <motion.h1
          animate={flickerAnimation}
          className="font-heading text-2xl md:text-3xl font-normal text-primary mb-10 tracking-tight neon-text uppercase"
        >
          A NOTE FROM THE CREATOR:
        </motion.h1>
        <div className="space-y-4 text-gray-300 leading-relaxed font-light text-[12px] md:text-base font-body">
          <p className="text-center text-[16px]">
            Season 1 was our first step into the world of Spore Fall. The success is yours—thank you to every viewer,
            supporter, and friend who brought it to life. To our amazing community: Your support and belief made this
            universe real. Now, the real work begins.
          </p>
          <br />
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-subheading text-lg md:text-[24px] font-bold mb-4 tracking-widest text-white uppercase leading-normal"
          >
            OUR NEXT MISSION:
          </motion.h2>
          <p className="text-center text-[16px] max-w-[80%] mx-auto mb-6">
            Complete Seasons 2 and 3 - the final chapters of our micro-drama trilogy. And after? We want to put a movie
            on the big screens.
          </p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-subheading text-lg md:text-[24px] font-bold mb-4 tracking-widest text-yellow-300 uppercase leading-normal"
          >
            &quot;YOUR CONTRIBUTION DIRECTLY UNLOCKS OUR PATH TO A FEATURE MOVIE RELEASE IN THEATRES&quot;
          </motion.h2>
        </div>
      </motion.section>

      <section className="text-center mb-30 px-5">
        <motion.h2
          animate={flickerAnimation}
          className="font-subheading text-lg md:text-[36px] font-bold mb-14 tracking-widest text-yellow-300 uppercase leading-normal "
        >
          &quot;THE SPORE FALL UNIVERSE NEEDS A HEARTBEAT <br className="hidden md:block" /> &amp; YOU HOLD THE
          KEY&quot;
        </motion.h2>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto relative"
          >
            {/* Decorative Icons behind Mission */}
            {/* <div className="absolute -left-20 top-0 opacity-10 pointer-events-none hidden lg:block">
              <Image src="/assets/images/evolve.png" alt="" width={80} height={80} />
            </div>
            <div className="absolute -right-20 top-0 opacity-10 pointer-events-none hidden lg:block">
              <Image src="/assets/images/resist.png" alt="" width={80} height={80} />
            </div> */}

            {/* <h4 className="font-subheading text-sm text-[30px] mb-6 text-white tracking-normal font-normal uppercase">
              THE MISSION:
            </h4>
            <p className="text-gray-400 text-sm md:text-lg leading-relaxed font-light font-body">
              Fund Seasons 2 &amp; 3 to expand the universe. Join our Inner Circle to co-create the future of{" "}
              <span className="text-primary font-bold">Spore Fall Chronicles</span> together.
            </p> */}
          </motion.div>

          <div className="pt-8 flex justify-center">
            <div className="relative group">
              {/* Automatic Outer Pulsing Glow (Resist Style) */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-primary/30 blur-3xl rounded-full pointer-events-none"
              />

              {/* Pulsing Outside Ring Effect (Matching Profile Image Style) */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -inset-4 border-2 border-primary/20 rounded-sm pointer-events-none z-0"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.2, 0.05] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -inset-8 border border-primary/10 rounded-sm pointer-events-none z-0"
              />

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={flickerAnimation}
                onClick={handleScrollToDonate}
                className="relative cursor-pointer bg-zinc-900/40 hover:bg-zinc-800/60 text-white group-hover:text-primary font-subheading font-black text-sm md:text-lg px-8 py-4 md:px-12 md:py-5 rounded-sm transition-all duration-500 uppercase tracking-[0.2em] border-2 border-primary/20 hover:border-primary transition-all duration-500 overflow-hidden flex flex-col items-center justify-center z-10 shadow-[0_0_30px_rgba(212,255,0,0.02)] hover:shadow-[0_0_60px_rgba(212,255,0,0.08)] backdrop-blur-xl"
              >
                {/* Outer Card Glow Extension (Resist Style) */}
                <div className="absolute -inset-[2px] rounded-sm bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <span className="relative z-10 transition-transform duration-500">Contribute Now</span>

                {/* Expanding Bottom Border (Resist Style) */}
                <div className="absolute bottom-0 left-0 w-0 h-[4px] bg-primary group-hover:w-full transition-all duration-500 z-20">
                  <div className="absolute inset-0 shadow-[0_0_15px_rgba(212,255,0,0.5)]" />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
