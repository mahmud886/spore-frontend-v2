"use client";
import { CircleArrowOutDownRight } from "lucide-react";
import { useState } from "react";
import { Wrapper } from "../shared/Wrapper";

export const SupportUsFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    {
      title: "ESTIMATED DELIVERY:",
      content: [
        "• Digital rewards begins shipping Q2 2026.",
        "• Physical items ship Q3 2026",
        "• Season 2 premiere targeted Q4 2026",
      ],
    },
    {
      title: "COMMUNITY:",
      content: ["• Backers gain future access to our private Inner Circle Channels & Live Events"],
    },
  ];

  return (
    <Wrapper>
      <section className="max-w-4xl mx-auto mt-56">
        <h2 className="font-subheading text-4xl font-black text-primary mb-16 tracking-widest uppercase neon-text">
          FAQ / KEY DETAILS SECTION:
        </h2>
        <div className="space-y-8">
          {faqs.map((faq, idx) => (
            <div key={faq.title} className="pb-6 border-b border-white/10">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                aria-expanded={openIndex === idx}
                className="flex justify-between items-center text-left w-full mb-4"
              >
                <span className="font-subheading text-xl text-white font-bold uppercase tracking-widest">
                  {faq.title}
                </span>
                <CircleArrowOutDownRight
                  className={`text-primary text-2xl transition-transform duration-300 ${
                    openIndex === idx ? "rotate-90" : ""
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="space-y-3 text-gray-400 font-light text-base pl-2">
                  {faq.content.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </Wrapper>
  );
};
