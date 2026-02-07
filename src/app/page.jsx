import { getBaseUrl } from "@/app/lib/services/base";
import { getBlogs } from "@/app/lib/services/blogs";
import { getEpisodes } from "@/app/lib/services/episodes";
import HomePage from "./components/home/HomePage";

export const revalidate = 60;

export async function generateMetadata() {
  const base = getBaseUrl();
  const title = "SPORE FALL | Sci-Fi Narrative Series";
  const description =
    "The city of Lionara is quarantined. A spore is rewriting human fate. Join the resistance or embrace the evolution.";
  const ogImage = `${base}/api/og?title=${encodeURIComponent("SPORE FALL")}&subtitle=${encodeURIComponent("THE CITY OF LIONARA IS QUARANTINED. A SPORE IS REWRITING HUMAN FATE.")}`;

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
          alt: "SPORE FALL - The city of Lionara is quarantined. A spore is rewriting human fate.",
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
  const [episodes, blogPosts] = await Promise.all([getEpisodes({ limit: 24, offset: 0 }), getBlogs()]);
  return <HomePage episodes={episodes} blogPosts={blogPosts} />;
}
