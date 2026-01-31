"use client";

import Image from "next/image";
import { AnimatedCard } from "../shared/AnimatedWrapper";
import Carousel from "../shared/Carousel";
import { SectionTitle } from "../shared/SectionTitle";

const characters = [
  {
    name: "Lena",
    role: "Technician",
    image: "/assets/images/characters/lena.png",
  },
  {
    name: "Eli",
    role: "Guide",
    image: "/assets/images/characters/eli.png",
  },
  {
    name: "Troopers",
    role: "Armour",
    image: "/assets/images/characters/troopers.png",
  },
  {
    name: "Dust Keeper",
    role: "Commando",
    image: "/assets/images/characters/dustkeeper.png",
  },
];

export default function CharacterLogsSection() {
  const renderCharacterCard = (character, index) => (
    <AnimatedCard key={index} hoverGlow={true} hoverFloat={true}>
      <div
        className="group relative bg-black/50"
        style={{
          borderTopRightRadius: "20px",
          borderBottomLeftRadius: "20px",
          padding: "3px",
          backgroundSize: "300% 300%",
          animation: "gradient-border 3s ease infinite",
        }}
      >
        {/* Content wrapper */}
        <div
          className="relative overflow-hidden  border-3 border-primary/10 group-hover:border-primary transition-all duration-500"
          style={{
            borderTopRightRadius: "17px",
            borderBottomLeftRadius: "17px",
          }}
        >
          <Image
            alt={character.name}
            className="w-full h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            src={character.image}
            width={400}
            height={500}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            quality={75}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 z-10">
            <span className="bg-primary text-black text-[9px] px-2 py-0.5 font-bold uppercase mb-2 inline-block">
              {character.role}
            </span>
            <h3 className="text-4xl font-display font-black text-white uppercase tracking-tighter">{character.name}</h3>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );

  return (
    <section className="py-24 px-8">
      <Carousel
        items={characters}
        renderItem={renderCharacterCard}
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
        gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        titleComponent={<SectionTitle>Character Logs</SectionTitle>}
      />
    </section>
  );
}
