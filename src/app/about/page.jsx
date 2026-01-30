"use client";

import AboutHeader from "../components/about/AboutHeader";
import ContactSection from "../components/about/ContactSection";

export default function AboutPage() {
  return (
    <main className="relative cyber-grid-bg min-h-screen">
      <AboutHeader />
      <ContactSection />
    </main>
  );
}
