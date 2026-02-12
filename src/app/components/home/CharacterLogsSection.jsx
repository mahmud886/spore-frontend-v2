"use client";

import Image from "next/image";
import { AnimatedCard } from "../shared/AnimatedWrapper";
import Carousel from "../shared/Carousel";
import { SectionTitle } from "../shared/SectionTitle";

const characters = [
  {
    name: "Lena Chen",
    role: "Botanist-in-training",
    year: "777 BF",
    image: "/assets/images/characters/01.jpg",
  },
  {
    name: "Marcus Varga",
    role: "Horticulturalist of Lionara Seed Vault",
    year: "777 BF",
    image: "/assets/images/characters/02.jpg",
  },
  {
    name: "Eli Chen",
    role: "Test Subject",
    status: "Infection Lvl 1",
    image: "/assets/images/characters/03.jpg",
  },
  {
    name: "Dust Keeper",
    role: "Spore Task Force Command",
    unit: "Valkyrie Protocol (Black Ops)",
    chain: "Direct synaptic link to LEADER X",
    image: "/assets/images/characters/04.jpg",
  },
  {
    name: "Leader X",
    role: "Leader of the Bastion Party",
    year: "Present Day",
    image: "/assets/images/characters/05.jpg",
  },
  {
    name: "Bastion Party Trooper",
    role: "Trooper",
    image: "/assets/images/characters/06.jpg",
  },
  {
    name: "Lena Chen",
    role: "Medic & Botanist",
    year: "Present Day",
    image: "/assets/images/characters/07.jpg",
  },
  {
    name: "Marcus Varga | Tactical",
    role: "Bastion Party Scout",
    year: "Present Day",
    image: "/assets/images/characters/08.jpg",
  },
  {
    name: "Aly",
    role: "New Alliance Defence Force Captain",
    image: "/assets/images/characters/09.jpg",
  },
  {
    name: "New Alliance Trooper",
    role: "NA Defence Force Enhanced",
    image: "/assets/images/characters/10.jpg",
  },
  {
    name: "Leader H",
    role: "Prime Leader of Golden Age Lionara",
    year: "777 BF",
    image: "/assets/images/characters/11.jpg",
  },
  {
    name: "Cordelia Rajan",
    status: "Status Unknown",
    image: "/assets/images/characters/12.jpg",
  },
  {
    name: "Lena Chen",
    status: "Status Unknown",
    year: "001 AF",
    image: "/assets/images/characters/13.jpg",
  },
  {
    name: "Marcus Varga",
    status: "Status Unknown",
    year: "001 AF",
    image: "/assets/images/characters/14.jpg",
  },
  {
    name: "Cleaner",
    role: "Deployment Unit",
    description: "Cleaners are deployed to dispose the Spore-infected in a unit of 3 or 4.",
    image: "/assets/images/characters/15.jpg",
  },
  {
    name: "Leader X",
    role: "Youth Party Leader of Young Lionara",
    year: "777 BF",
    image: "/assets/images/characters/16.jpg",
  },
  {
    name: "Eli Chen",
    role: "Scavenger",
    image: "/assets/images/characters/17.jpg",
  },
  {
    name: "Marcus Varga | Military Fatigue",
    role: "Bastion Party Cadet",
    year: "Present Day",
    image: "/assets/images/characters/18.jpg",
  },
];

export default function CharacterLogsSection() {
  const renderCharacterCard = (character, index) => (
    <AnimatedCard key={index} hoverGlow={true} hoverFloat={true}>
      <div
        className="group relative bg-black/50 cursor-pointer touch-manipulation"
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
          className="relative overflow-hidden border-3 border-primary/10 group-hover:border-primary group-active:border-primary transition-all duration-500"
          style={{
            borderTopRightRadius: "17px",
            borderBottomLeftRadius: "17px",
          }}
        >
          <Image
            alt={character.name}
            className="w-full h-[450px] object-cover grayscale-0 md:grayscale md:group-hover:grayscale-0 group-active:grayscale-0 transition-all duration-500"
            src={character.image}
            width={400}
            height={500}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            quality={75}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
            {character.year && (
              <span className="text-primary font-display text-[10px] tracking-widest font-black bg-black/80 px-2 py-0.5 border border-primary/20">
                {character.year}
              </span>
            )}
          </div>

          <div className="absolute bottom-6 left-6 z-10 right-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {character.status && (
                <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 font-bold uppercase tracking-tighter">
                  {character.status}
                </span>
              )}
              {character.role && (
                <span className="bg-primary text-black text-[9px] px-2 py-0.5 font-bold uppercase tracking-tighter max-w-full truncate">
                  {character.role}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter leading-none break-words">
              {character.name}
            </h3>
            {character.description && (
              <p className="text-[10px] text-gray-400 mt-2 font-body leading-tight opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500">
                {character.description}
              </p>
            )}
            {character.unit && (
              <p className="text-[9px] text-primary/80 mt-1 font-display tracking-widest uppercase">{character.unit}</p>
            )}
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
