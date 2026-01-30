"use client";

import { motion } from "framer-motion";
import { AnimatedWrapper } from "../components/shared/AnimatedWrapper";
import { SectionTitle } from "../components/shared/SectionTitle";
import { fadeUp } from "../utils/animations";

export default function SupportUsPage() {
  return (
    <div className="min-h-screen bg-black text-white cyber-holographic">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 cyber-grid-overlay opacity-20" />
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedWrapper variant={fadeUp} className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 cyber-glow-blink">
              <span className="text-primary">SUPPORT</span> THE RESISTANCE
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed">
              Join the movement. Your contribution fuels the fight for humanity&apos;s future.
            </p>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Mission Statement */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <SectionTitle className="mb-8">Our Mission</SectionTitle>
              <div className="space-y-6">
                <p className="text-lg text-white/80 leading-relaxed">
                  In the darkest hour of human evolution, we stand as the last bastion of free will. The spore spreads,
                  but so does our resistance.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  Your support enables us to broadcast signals, mobilize networks, and fight for humanity&apos;s right
                  to choose its own destiny.
                </p>
                <div className="pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-primary rounded-full cyber-glow-pulse" />
                    <span className="text-primary font-bold uppercase tracking-widest text-sm">
                      10,984 signals broadcasted
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Support Options */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-black/50 border border-primary/20 p-8 rounded-2xl cyber-energy-wave"
            >
              <h3 className="text-2xl font-bold text-primary mb-6 uppercase tracking-widest">How You Can Help</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Spread The Word</h4>
                    <p className="text-white/70">
                      Share our message across all platforms. Every voice matters in this fight.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Stay Informed</h4>
                    <p className="text-white/70">
                      Subscribe to updates. Knowledge is our greatest weapon against the spore.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Take Action</h4>
                    <p className="text-white/70">
                      Vote, mobilize your network, and stand with those who refuse to evolve.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <AnimatedWrapper variant={fadeUp} className="text-center max-w-3xl mx-auto">
            <SectionTitle className="mb-8">Join The Fight</SectionTitle>
            <p className="text-xl text-white/80 mb-12 leading-relaxed">
              The city may be quarantined, but our message is not. Together, we can hold the line and preserve what
              makes us human.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(194, 255, 2, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-black font-bold px-8 py-4 rounded-lg uppercase tracking-widest hover:bg-[#a8db02] transition-all duration-300"
              >
                Mobilize Network
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="border border-primary text-primary font-bold px-8 py-4 rounded-lg uppercase tracking-widest hover:bg-primary/10 transition-all duration-300"
              >
                Stay Updated
              </motion.button>
            </div>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Footer Message */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/50 uppercase tracking-widest text-sm">
            The future is not predetermined. The choice is ours.
          </p>
        </div>
      </section>
    </div>
  );
}
