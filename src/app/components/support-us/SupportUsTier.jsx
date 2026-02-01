import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import { Wrapper } from "../shared/Wrapper";

export const SupportUsTier = () => {
  const tiers = [
    {
      id: "archivist",
      heading: "TIER 1: THE ARCHIVIST",
      headingClass: "font-subheading text-4xl font-normal text-primary mb-6 uppercase tracking-wider",
      description:
        "Become a Founding Community Member. Receive secret intelligence drips from within the Spore Fall universe.",
      bullets: [
        { bold: "classNameified Intel Drops:", text: "Exclusive character back-stories and secret world logs." },
        { bold: "Dossier Access:", text: "Detailed key character bios." },
        { bold: "Mission Briefings:", text: "Direct updates on all future content and product launches." },
        { bold: "Your Role:", text: "The insider. You keep the records." },
      ],
      card: {
        label: "THE ARCHIVIST",
        price: "$39",
        iconClass: "text-primary text-xl",
        qrSrc: "/assets/images/support-us/QR.png",
      },
    },
    {
      id: "emblem",
      heading: "TIER 2: THE EMBLEM",
      headingClass: "font-subheading text-4xl font-black text-primary mb-6 uppercase tracking-wider",
      description: "Wear your allegiance. Everything in Tier 1, plus official founding member gear.",
      bullets: [
        { headline: "INCLUDES ALL TIER 1 REWARDS." },
        {
          bold: "Founder’s Kit:",
          text: "An exclusive apparel item & collectible pin set. (Singapore Addresses Only)",
        },
        {
          bold: "Field Tote:",
          text: "A sturdy, tactical tote bag for your mission essentials. (Singapore Addresses Only)",
        },
        { text: "Personal invitation to launch party and live screening of season 2", strongOnly: true },
        {
          bold: "Your Role:",
          text: "The visible vanguard. You represent the Circle in the outside world.",
        },
      ],
      card: {
        label: "THE EMBLEM",
        price: "$69",
        iconClass: "text-primary text-3xl",
        qrSrc: "/assets/images/support-us/QR.png",
      },
    },
    {
      id: "patron",
      heading: "TIER 3: THE PATRON",
      headingClass: "font-subheading text-4xl font-black text-primary mb-6 uppercase tracking-wider",
      description: "Shape the legacy. Ultimate access + your name forever part of Spore Fall.",
      bullets: [
        { headline: "INCLUDES ALL TIER 1 & TIER 2 REWARDS." },
        {
          bold: "The Creator’s Cut:",
          text: "Unlock bonus hidden scenes in Season 2 & 3 that reveal crucial, unseen moments.",
        },
        {
          bold: "Immortalized in the Credits:",
          text: "Your name permanently featured in the credits of Seasons 2 & 3.",
        },
        {
          bold: "Your Role:",
          text: "The honored patron. Your support directly unlocks deeper stories and secures your place in our history.",
        },
      ],
      card: {
        label: "THE PATRON",
        price: "$129",
        iconClass: "text-primary text-xl",
        qrSrc: "/assets/images/support-us/QR.png",
      },
    },
  ];

  return (
    <Wrapper>
      <div className="space-y-48">
        {tiers.map((tier) => (
          <div key={tier.id} className="grid lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-2">
              <h2 className={tier.headingClass}>{tier.heading}</h2>
              <p className="text-gray-400 mb-10 max-w-md text-sm leading-relaxed">{tier.description}</p>
              <ul className="space-y-5">
                {tier.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircleIcon className="text-primary text-xl" />
                    {b.headline ? (
                      <span className="text-white font-bold uppercase text-[10px] tracking-[0.2em]">{b.headline}</span>
                    ) : b.strongOnly ? (
                      <span className="text-sm text-white font-semibold">{b.text}</span>
                    ) : (
                      <span className="text-sm">
                        <strong className="text-white font-semibold">{b.bold}</strong> {b.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="tier-card-inner p-8 rounded-lg relative bg-black/50 border border-primary/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <CheckCircleIcon className={tier.card.iconClass} />
                    <div>
                      <div className="font-subheading text-[10px] tracking-[0.3em] text-primary uppercase font-bold mb-1">
                        {tier.card.label}
                      </div>
                      <div className="font-subheading text-5xl font-black text-white">{tier.card.price}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] uppercase font-bold text-gray-500 mb-2 tracking-widest">
                      stripe | <span className="text-primary">PAYNOW</span>
                    </div>
                    <Image
                      width={50}
                      height={50}
                      alt="Payment QR"
                      className="w-20 h-20 bg-white p-1 rounded-sm ml-auto"
                      src={tier.card.qrSrc}
                    />
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary text-black font-subheading font-black py-5 rounded-sm hover:opacity-90 transition-all uppercase tracking-[0.2em] text-lg">
                BACK THE CAMPAIGN.
              </button>
              <p className="text-center font-subheading text-[10px] tracking-[0.4em] text-gray-400 uppercase mt-4">
                Power Our Universe
              </p>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
