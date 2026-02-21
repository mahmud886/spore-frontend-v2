import { getBaseUrl } from "@/app/lib/services/base";
import { getEpisodes } from "@/app/lib/services/episodes";
import HomePage from "./components/home/HomePage";

export const revalidate = 60;

export async function generateMetadata() {
  const base = getBaseUrl();
  const title = "SPORE FALL | a Sci-Fi Saga";
  const description =
    "A deadly pathogen threatens to overrun the nation city of Lionara. Join the resistance or embrace the evolution.";
  const ogImage = `${base}/api/og?title=${encodeURIComponent("SPORE FALL")}&subtitle=${encodeURIComponent("A DEADLY PATHOGEN THREATENS TO OVERRUN THE NATION CITY OF LIONARA. JOIN THE RESISTANCE OR EMBRACE THE EVOLUTION.")}`;

  return {
    title,
    description,
    keywords: [
      // Top Level SEO
      "Spore Fall",
      "Sporefall",
      "The Spore Fall",
      "The Spore",
      "The Sporefall",
      "Spore",
      "Spore Fall Saga",
      "Sporefall Saga",
      "The Spore Saga",
      "The Sporefall Saga",
      "Spore Saga",
      "Spore Fall Chronicles",
      "Sporefall Chronicles",
      "The Spore Chronicles",
      "The Sporefall Chronicles",
      "Spore Chronicles",
      // Primary / "Money" Keywords
      "Edenstone Group",
      "Edenstone IP",
      "Lionara",
      "Lionara city",
      "Spore pathogen story",
      // Genre & Narrative Keywords
      "Speculative fiction",
      "Dystopian sci-fi",
      "Biopunk narrative",
      "Singaporean sci-fi",
      "Singapore speculative fiction",
      "Post-apocalyptic story",
      "Cyberpunk city stories",
      "Sci-fi pathogen outbreak",
      "Mutation fiction",
      "Zombie apocalypse",
      // Character & Plot Keywords
      "Disillusioned soldier character",
      "Rogue medic story",
      "Infected brother narrative",
      "Mutant abilities sci-fi",
      "Human evolution fiction",
      "Resistance vs regime story",
      "Iron-fisted regime dystopia",
      // Technology & Innovation Keywords
      "AI-enhanced storytelling",
      "AI world-building",
      "Web3 entertainment",
      "Web3 community engagement",
      "Multi-platform narrative",
      "Transmedia IP",
      "Immersive storytelling",
      "Interactive narrative experience",
      "Tech-augmented storytelling",
      // Business & IP Keywords
      "Scalable intellectual property",
      "IP development platform",
      "De-risking IP development",
      "Community co-creation",
      "Franchise valuation levers",
      "Original IP valuation",
      "Media franchise development",
      "Scalable entertainment franchise",
      "Media and entertainment investment opportunities",
      // Thematic & Philosophical Keywords
      "The future will be chosen",
      "Reimagining identity fiction",
      "Evolution vs Resistance",
      "Embracing evolution narrative",
      "Identity in speculative fiction",
      "Infection abilities",
      // Long-Tail Keywords
      "What is the Spore Fall universe?",
      "Story about pathogen that causes evolution",
      "Multi-platform sci-fi universe Singapore",
      "Interactive stories like Spore Fall",
      "Edenstone Group projects",
      "Futuristic city name Lionara",
      "Sci-fi stories about evolution",
    ],
    openGraph: {
      title,
      description,
      url: base,
      siteName: "SPORE FALL",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `SPORE FALL - ${description}`,
          type: "image/jpeg",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Home() {
  const episodes = await getEpisodes({ limit: 24, offset: 0 });
  return <HomePage episodes={episodes} />;
}
