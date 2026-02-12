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
    keywords: ["Spore Fall", "Sci-Fi", "Narrative Series", "Lionara", "Audio Drama", "Interactive Story"],
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
