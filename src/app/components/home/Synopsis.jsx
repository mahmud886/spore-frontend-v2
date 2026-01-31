"use client";

import { motion } from "framer-motion";
import { fadeUp } from "../../utils/animations";

export function Synopsis() {
  const handleWatchNow = () => {
    const element = document.getElementById("prologue");
    if (element) {
      const offset = 80; // Account for sticky navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative pt-[450px] pb-20 overflow-hidden cyber-scanline">
      {/* Background Video */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      >
        <video
          src="/assets/videos/dustkeeper_1.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" /> */}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto"
        >
          <p className="text-2xl md:text-3xl font-subheading text-gray-300 leading-relaxed text-center">
            In the fractured city of Lionara where a deadly Spore pathogen outbreak is brutally suppressed by an
            iron-fisted regime, a disillusioned soldier and a rogue medic must bridge their ideological divide when her
            infected brother develops predictive abilities that could accelerate humanity&#39;s evolution or end it.
          </p>
        </motion.div>
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-10 text-center"
        >
          <motion.button
            onClick={handleWatchNow}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(194, 255, 2, 0.5)",
            }}
            whileTap={{ scale: 0.98 }}
            style={{ borderTopRightRadius: "8px", borderBottomLeftRadius: "8px" }}
            className="bg-[#C2FF02] font-subheading tracking-widest hover:bg-[#a8db02] text-black text-[24px] md:text-[32px] lg:text-[48px] leading-[28px] font-semibold py-5 px-10 md:py-8 md:px-20 shadow-lg hover:shadow-xl transition-all duration-300  mx-auto cyber-glow-pulse cyber-neon-trail rounded-tr-8 rounded-bl-8"
          >
            Watch Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
