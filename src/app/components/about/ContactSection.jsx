"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, staggerContainer } from "../../utils/animations";
import { AnimatedCard, AnimatedWrapper } from "../shared/AnimatedWrapper";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactCards = [
    {
      icon: "mail",
      label: "EMAIL",
      value: "contact@sporefall.com",
    },
    {
      icon: "smartphone",
      label: "PHONE",
      value: "+88 0 1234 56 9",
    },
    {
      icon: "location_on",
      label: "LOCATION",
      value: "Singapore",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:col-span-4 space-y-6"
        >
          {contactCards.map((card, index) => (
            <AnimatedCard
              key={index}
              hoverGlow={true}
              hoverFloat={true}
              className="bg-terminal-gray border border-white/10 p-6 rounded-lg group hover:border-primary/50 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-12 h-1 bg-primary/40"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-primary">{card.icon}</span>
                  <span className="font-display text-sm tracking-widest text-white/50">{card.label}</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                  <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </div>
              </div>
              <p className="font-mono text-lg text-white/80">{card.value}</p>
            </AnimatedCard>
          ))}
        </motion.div>
        <AnimatedWrapper variant={fadeUp} delay={0.3} className="lg:col-span-8">
          <div className="bg-terminal-gray border border-white/10 p-10 rounded-lg cyber-scanline cyber-holographic cyber-power-surge">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-mono text-xs text-white/50 tracking-widest uppercase">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 focus:border-primary rounded px-4 py-3 text-white placeholder:text-white/40 outline-none transition-colors"
                    placeholder="Jane Smith"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-xs text-white/50 tracking-widest uppercase">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 focus:border-primary rounded px-4 py-3 text-white placeholder:text-white/40 outline-none transition-colors"
                    placeholder="jane@info.com"
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-white/50 tracking-widest uppercase">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 focus:border-primary rounded px-4 py-3 text-white placeholder:text-white/40 outline-none transition-colors resize-none"
                  placeholder="Your message..."
                  rows="6"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-white/5 border border-white/10 hover:border-primary hover:text-primary py-4 px-8 rounded flex items-center justify-center space-x-2 transition-all group"
              >
                <span className="font-display font-bold text-sm tracking-widest uppercase">Contact with us</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_right_alt
                </span>
              </button>
            </form>
          </div>
        </AnimatedWrapper>
      </div>
    </section>
  );
}
