import { getBaseUrl } from "@/app/lib/services/base";
import { getEpisodes } from "@/app/lib/services/episodes";
import { getProducts } from "@/app/lib/services/products";
import { getBlogs } from "@/app/lib/services/supabase-blogs";
import { createClient } from "@/app/lib/supabase-server";
import { Suspense } from "react";
import ResultContent from "./ResultContent";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;
  const base = getBaseUrl();
  const supabase = await createClient();
  const episodeId = searchParams?.episode || null;
  const utmContent = searchParams?.utm_content || null;
  let pollParam = searchParams?.poll || searchParams?.pollId || null;
  if (!pollParam && typeof utmContent === "string" && utmContent.startsWith("poll_")) {
    pollParam = utmContent.replace("poll_", "");
  }
  let poll = null;
  if (pollParam) {
    const { data } = await supabase.from("polls").select("*, poll_options(*)").eq("id", pollParam).single();
    if (data) {
      poll = { ...data, options: data.poll_options || [] };
    }
  } else if (episodeId) {
    const { data } = await supabase
      .from("polls")
      .select("*, poll_options(*)")
      .eq("episode_id", episodeId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (Array.isArray(data) && data.length > 0) {
      const p = data[0];
      poll = { ...p, options: p.poll_options || [] };
    }
  }
  const title = poll
    ? `${(poll.question || poll.title || "Poll Results").toUpperCase()} | SPORE FALL`
    : "POLL RESULTS | SPORE FALL | a Sci-Fi Saga";
  const totalVotes =
    poll && Array.isArray(poll.options) ? poll.options.reduce((sum, o) => sum + (o.vote_count || o.votes || 0), 0) : 0;
  const description = poll
    ? `View the latest results for: ${poll.question || poll.title}. Join ${totalVotes} others in shaping this Sci-Fi Saga.`
    : `A deadly pathogen threatens to overrun the nation city of Lionara. Join ${totalVotes} others in shaping the resistance or embracing the evolution.`;
  const pollIdForImage = poll ? poll.id : pollParam || "";
  const platform = (searchParams?.utm_source || "").toLowerCase();
  const platformSizeMap = {
    facebook: "facebook",
    twitter: "twitter",
    x: "twitter",
    x_share: "twitter",
    linkedin: "linkedin",
    pinterest: "pinterest",
    whatsapp: "whatsapp",
    telegram: "facebook",
    reddit: "facebook",
    instagram: "instagram",
    tiktok: "tiktok",
  };
  const sizeParam = platformSizeMap[platform] || "facebook";
  const ogImage = pollIdForImage
    ? `${base}/api/polls/${encodeURIComponent(pollIdForImage)}/image?size=${sizeParam}&format=jpg&v=3`
    : `${base}/api/polls/default/image?size=${sizeParam}&format=jpg&v=3`;

  const url = `${base}/result${episodeId || pollParam ? "?" : ""}${
    episodeId ? `episode=${encodeURIComponent(episodeId)}` : ""
  }${episodeId && pollParam ? "&" : ""}${pollParam ? `poll=${encodeURIComponent(pollParam)}` : ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "SPORE FALL",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Poll Results for: ${title}`,
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

export default async function Result(props) {
  const searchParams = await props.searchParams;
  const [products, episodes, blogs] = await Promise.all([
    getProducts({ limit: 20, offset: 0 }),
    getEpisodes({ limit: 10, offset: 0 }),
    getBlogs(),
  ]);
  return (
    <Suspense>
      <ResultContent products={products} episodes={episodes} blogs={blogs} searchParams={searchParams} />
    </Suspense>
  );
}
