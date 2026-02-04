"use client";
import { CheckCircleIcon, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Wrapper } from "../shared/Wrapper";

export const SupportUsTier = () => {
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState({});

  const handleInputChange = (tierId, field, value) => {
    setForms((prev) => ({
      ...prev,
      [tierId]: {
        ...prev[tierId],
        [field]: value,
      },
    }));
  };

  const handleCheckout = async (tier) => {
    const formData = forms[tier.id] || {};
    const { name, email, note, customAmount, mailingAddress } = formData;

    try {
      if (!name || !email) {
        alert("Please enter your name and email.");
        return;
      }

      setLoading(true);
      let amount;
      let tierName = tier.card.label;

      if (tier.id === "support-universe") {
        if (!customAmount || isNaN(customAmount) || Number(customAmount) <= 0) {
          alert("Please enter a valid donation amount");
          setLoading(false);
          return;
        }
        amount = Number(customAmount);
      } else {
        amount = Number(tier.card.price.replace("$", ""));
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          tierName,
          tierId: tier.id,
          name,
          email,
          mailingAddress,
          note,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error:", error);
      // Redirect to error page with message
      window.location.href = `/payment/payment-error?message=${encodeURIComponent(error.message)}`;
    } finally {
      setLoading(false);
    }
  };

  const tiers = [
    {
      id: "archivist",
      heading: "TIER 1: THE ARCHIVIST",
      headingClass: "font-subheading text-4xl font-normal text-primary mb-6 uppercase tracking-wider",
      description: "The ultimate insider access for supporters who want to go deeper into the Spore Fall universe.",
      bullets: [
        { bold: "Classified Intel Drops:", text: "Exclusive character backstories and secret world logs." },
        { bold: "Dossier Access:", text: "Detailed bios of key characters and factions." },
        { bold: "Mission Briefings:", text: "Direct updates on Seasons 2 & 3 and future launches." },
        { text: "You preserve the knowledge, track the truth, and keep the records of a fallen city alive." },
      ],
      card: {
        label: "THE ARCHIVIST",
        price: "$39",
        iconClass: "text-primary w-5 h-5 shrink-0",
        qrSrc: "/assets/images/support-us/QR.png",
      },
      footerText: "Unlock the Archives",
    },
    {
      id: "emblem",
      heading: "TIER 2: THE EMBLEM",
      headingClass: "font-subheading text-4xl font-black text-primary mb-6 uppercase tracking-wider",
      description: "For fans who believe in the story and want to wear their allegiance.",
      badges: [
        {
          icon: Star,
          text: "MOST POPULAR",
          subtext: "Chosen by most Founding Members",
        },
      ],
      bullets: [
        {
          bold: "Founder’s Kit:",
          text: "Exclusive apparel item + collectible pin set. (Singapore addresses only)",
        },
        {
          bold: "Field Tote:",
          text: "Durable tactical tote for everyday missions. (Singapore addresses only)",
        },
        { bold: "Personal Invitation:", text: "Launch party + live screening of Season 2." },
        {
          text: "You carry the symbol. You signal belief. You bring the universe beyond the screen.",
        },
      ],
      card: {
        label: "THE EMBLEM",
        price: "$69",
        iconClass: "text-primary w-8 h-8 shrink-0",
        qrSrc: "/assets/images/support-us/QR.png",
      },
      footerText: "Join the Inner Circle",
    },
    {
      id: "patron",
      heading: "TIER 3: THE PATRON",
      headingClass: "font-subheading text-4xl font-black text-primary mb-6 uppercase tracking-wider",
      description: "This tier is for supporters who want their name permanently woven into Spore Fall history.",
      note: "Patron perks close once Season 2 enters final edit.",
      bullets: [
        {
          bold: "The Creator’s Cut:",
          text: "Bonus hidden scenes from Seasons 2 & 3 revealing unseen moments.",
        },
        {
          bold: "Immortalised in the Credits:",
          text: "Your name permanently featured in Seasons 2 & 3.",
        },
        {
          text: "Your support unlocks deeper stories and ensures this universe endures beyond its origins.",
        },
      ],
      card: {
        label: "THE PATRON",
        price: "$129",
        iconClass: "text-primary w-5 h-5 shrink-0",
        qrSrc: "/assets/images/support-us/QR.png",
      },
      footerText: "Immortalize My Name",
    },
    {
      id: "support-universe",
      heading: "SUPPORT THE UNIVERSE — DONATE ANY AMOUNT",
      headingClass: "font-subheading text-4xl font-normal text-primary mb-6 uppercase tracking-wider",
      description: (
        <>
          For those who simply want to support the story—no tiers, no rewards required. <br /> <br />
          <strong className="text-white font-bold">No rewards. No labels. Just belief in the story.</strong> <br />{" "}
          Every contribution helps fund production, support artists, and bring Spore Fall closer to the big screen.
        </>
      ),
      bullets: [{ text: "Name listed on the official supporters page" }, { text: "Early-access community email" }],
      card: {
        label: "DONATE",
        price: "ANY",
        iconClass: "text-primary w-5 h-5 shrink-0",
        qrSrc: "/assets/images/support-us/QR.png",
      },
      footerText: "Power Our Universe",
    },
  ];

  return (
    <Wrapper>
      <div className="space-y-16 lg:space-y-48">
        {tiers.map((tier) => (
          <div key={tier.id} id={tier.id} className="grid lg:grid-cols-3 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-2">
              <h2 className={tier.headingClass}>{tier.heading}</h2>
              {tier.badges && (
                <div className="flex flex-col gap-2 mb-6">
                  {tier.badges.map((badge, idx) => (
                    <div key={idx} className="flex flex-col">
                      <div className="flex items-center gap-2 text-primary">
                        <badge.icon className="w-5 h-5 fill-current" />
                        <span className="font-bold font-subheading tracking-widest uppercase text-sm">
                          {badge.text}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs pl-7">{badge.subtext}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-gray-400 mb-6 max-w-md text-sm leading-relaxed">{tier.description}</p>
              {tier.note && (
                <p className="text-primary/80 mb-10 text-xs italic tracking-wide max-w-md border-l-2 border-primary/30 pl-3 py-1">
                  {tier.note}
                </p>
              )}
              {!tier.note && <div className="mb-10"></div>}
              <ul className="space-y-5">
                {tier.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircleIcon className="text-primary w-5 h-5 shrink-0" />
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
                {tier.badges && (
                  <div className="mb-6">
                    {tier.badges.map((badge, idx) => (
                      <div key={idx} className="flex flex-col">
                        <div className="flex items-center gap-2 text-primary">
                          <badge.icon className="w-4 h-4 fill-current" />
                          <span className="font-bold font-subheading tracking-widest uppercase text-xs">
                            {badge.text}
                          </span>
                        </div>
                        <span className="text-gray-400 text-[10px] pl-6">{badge.subtext}</span>
                      </div>
                    ))}
                  </div>
                )}
                {tier.note && (
                  <p className="text-primary/80 mb-6 text-[10px] italic tracking-wide border-l-2 border-primary/30 pl-3 py-1">
                    {tier.note}
                  </p>
                )}
                <div className="space-y-3 mb-6">
                  <input
                    type="text"
                    placeholder="YOUR NAME"
                    value={forms[tier.id]?.name || ""}
                    onChange={(e) => handleInputChange(tier.id, "name", e.target.value)}
                    className="w-full bg-transparent border-b border-primary/30 text-white py-2 px-1 focus:border-primary focus:outline-none placeholder-gray-600 text-[10px] font-bold tracking-widest uppercase"
                  />
                  <input
                    type="email"
                    placeholder="YOUR EMAIL"
                    value={forms[tier.id]?.email || ""}
                    onChange={(e) => handleInputChange(tier.id, "email", e.target.value)}
                    className="w-full bg-transparent border-b border-primary/30 text-white py-2 px-1 focus:border-primary focus:outline-none placeholder-gray-600 text-[10px] font-bold tracking-widest uppercase"
                  />
                  <input
                    type="text"
                    placeholder="ENTER YOUR MAILING ADDRESS"
                    value={forms[tier.id]?.mailingAddress || ""}
                    onChange={(e) => handleInputChange(tier.id, "mailingAddress", e.target.value)}
                    className="w-full bg-transparent border-b border-primary/30 text-white py-2 px-1 focus:border-primary focus:outline-none placeholder-gray-600 text-[10px] font-bold tracking-widest uppercase"
                  />
                  <input
                    type="text"
                    placeholder="ADD A NOTE (OPTIONAL)"
                    value={forms[tier.id]?.note || ""}
                    onChange={(e) => handleInputChange(tier.id, "note", e.target.value)}
                    className="w-full bg-transparent border-b border-primary/30 text-white py-2 px-1 focus:border-primary focus:outline-none placeholder-gray-600 text-[10px] font-bold tracking-widest uppercase"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <CheckCircleIcon className={tier.card.iconClass} />
                    <div>
                      <div className="font-subheading text-[10px] tracking-[0.3em] text-primary uppercase font-bold mb-1">
                        {tier.card.label}
                      </div>
                      {tier.id === "support-universe" ? (
                        <div className="flex items-center gap-2">
                          <span className="font-subheading text-2xl font-black text-white">$</span>
                          <input
                            id="donate-custom-amount"
                            type="number"
                            min="1"
                            placeholder="ANY"
                            value={forms[tier.id]?.customAmount || ""}
                            onChange={(e) => handleInputChange(tier.id, "customAmount", e.target.value)}
                            className="bg-transparent border-b-2 border-primary/50 text-white font-subheading text-3xl font-black w-32 focus:outline-none focus:border-primary placeholder-gray-600"
                          />
                        </div>
                      ) : (
                        <div className="font-subheading text-5xl font-black text-white">{tier.card.price}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div
                      onClick={() => !loading && handleCheckout(tier)}
                      className={`flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded border border-white/10 backdrop-blur-sm transition-all ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:bg-white/10 hover:scale-105 active:scale-95"
                      }`}
                    >
                      <Image
                        src="/assets/images/support-us/stripe-logo.svg"
                        alt="Stripe"
                        width={60}
                        height={25}
                        className="h-8 w-auto "
                      />
                    </div>
                    <button
                      onClick={() => handleCheckout(tier)}
                      disabled={loading}
                      className="cursor-pointer bg-primary text-black text-[11px] font-bold px-5 py-2 rounded-sm uppercase hover:brightness-110 transition-all tracking-widest shadow-[0_0_15px_rgba(194,255,2,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "..." : "Pay Now"}
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleCheckout(tier)}
                disabled={loading}
                className="w-full bg-primary text-black font-subheading font-black py-5 rounded-sm hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-[0.2em] text-lg shadow-[0_0_20px_rgba(194,255,2,0.2)] group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">{loading ? "PROCESSING..." : "BACK THE CAMPAIGN."}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              <div className="w-fit mx-auto px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mt-4 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default font-subheading text-[10px] tracking-[0.2em] text-gray-300 uppercase">
                {tier.footerText}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
