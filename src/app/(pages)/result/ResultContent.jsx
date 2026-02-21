"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ShareMediaModal from "../../components/popups/ShareMediaModal";
import ResultPage from "../../components/result/ResultPage";
import { trackEvent } from "../../components/shared/Analytics";
import ResultLoader from "../../components/shared/skeletons/ResultLoader";

export default function ResultContent({ products: products = [], episodes: episodes = [], blogs: blogs = [] }) {
  const searchParams = useSearchParams();
  const episodeId = searchParams.get("episode");
  const pollIdParam = searchParams.get("poll") || searchParams.get("pollId");

  const utmContent = searchParams.get("utm_content");
  const pollIdFromUtm = utmContent && utmContent.startsWith("poll_") ? utmContent.replace("poll_", "") : null;

  const pollId = pollIdParam || pollIdFromUtm;

  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(!!episodeId || !!pollId);
  const [copied, setCopied] = useState(false);
  const [shareModal, setShareModal] = useState({ isOpen: false, platform: "", imageUrl: "" });

  useEffect(() => {
    if (pollId) {
      const fetchPollById = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/polls/${encodeURIComponent(pollId)}`);
          if (!response.ok) {
            setLoading(false);
            return;
          }
          const data = await response.json();
          if (data.poll) {
            const poll = {
              ...data.poll,
              options: data.poll.options || data.poll.poll_options || [],
            };
            setPollData(poll);
          }
        } catch {
        } finally {
          setLoading(false);
        }
      };
      fetchPollById();
      return;
    }

    if (!episodeId) {
      setLoading(false);
      return;
    }

    const fetchPollData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/polls/episode/${encodeURIComponent(episodeId)}`);
        if (!response.ok) {
          setLoading(false);
          return;
        }
        const data = await response.json();
        if (data.polls && data.polls.length > 0) {
          const poll = data.polls.find((p) => p.status === "LIVE") || data.polls[0];
          if (poll && poll.id) {
            setPollData(poll);
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, [episodeId, pollId]);

  useEffect(() => {
    if (typeof window === "undefined" || !pollData || !pollData.id) {
      return;
    }

    const totalVotes = (pollData.options || []).reduce((sum, opt) => sum + (opt.votes || opt.vote_count || 0), 0);
    // Add a timestamp to bust social media caches (especially Facebook)
    const timestamp = new Date().getTime();
    const imageUrl = `${window.location.origin}/api/polls/${pollData.id}/image?format=png&size=facebook&t=${timestamp}`;
    const shareUrl = window.location.href.split("?")[0];

    const updateMetaTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const updateNameTag = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const pollTitle = pollData.question || pollData.title || "Poll Results";
    updateMetaTag("og:title", pollTitle);
    updateMetaTag("og:description", `Poll Results - ${totalVotes} total votes`);
    updateMetaTag("og:image", imageUrl);
    updateMetaTag("og:image:width", "1200");
    updateMetaTag("og:image:height", "630");
    updateMetaTag("og:url", shareUrl);
    updateMetaTag("og:type", "website");
    updateMetaTag("og:image:type", "image/png");

    updateNameTag("twitter:card", "summary_large_image");
    updateNameTag("twitter:title", pollTitle);
    updateNameTag("twitter:description", `Poll Results - ${totalVotes} total votes`);
    updateNameTag("twitter:image", `${window.location.origin}/api/polls/${pollData.id}/image?format=png&size=twitter`);
  }, [pollData]);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, []);

  const trackSocialClick = async (platform) => {
    if (!pollData) return;
    try {
      const utmParams = {
        utm_source: platform.toLowerCase(),
        utm_medium: "social",
        utm_campaign: "poll_share",
        utm_content: `poll_${pollData.id}`,
      };
      await fetch("/api/analytics/social-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poll_id: pollData.id,
          platform: platform.toLowerCase(),
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          ...utmParams,
        }),
      });
      trackEvent("social_share_click", {
        platform: platform.toLowerCase(),
        poll_id: pollData.id,
        poll_question: pollData.question,
        ...utmParams,
      });
    } catch {}
  };

  const getUTMUrl = (platform) => {
    if (typeof window === "undefined") return "";

    const url = new URL(window.location.href);
    const urlSearchParams = url.searchParams;

    // Ensure episode param is present if we have it
    if (episodeId && !urlSearchParams.has("episode")) {
      urlSearchParams.set("episode", episodeId);
    }

    // Set UTM parameters while keeping existing ones
    urlSearchParams.set("utm_source", platform.toLowerCase());
    urlSearchParams.set("utm_medium", "social");
    urlSearchParams.set("utm_campaign", "poll_share");

    if (pollData?.id) {
      urlSearchParams.set("utm_content", `poll_${pollData.id}`);
    }

    return url.toString();
  };

  const handleShare = (platform) => {
    console.log("handleShare called with platform:", platform);

    // Safety check for platform string
    if (!platform || typeof platform !== "string") {
      console.warn("Invalid platform provided to handleShare");
      return;
    }

    const platformUpper = platform.toUpperCase();

    // Fallback for pollData during development/missing data
    const effectivePollData = pollData || { id: "default", question: "Check out SPORE FALL" };

    const utmUrl = getUTMUrl(platform);

    const fullShareText = `SE Asia’s 1st Gen-AI sci-fi micro-drama just
dropped the pen. ✍️

Spore Fall wants YOU to decide:
✊🏻 Resist
🦅 Evolve

Vote with me before it closes → ${utmUrl}
First 1,000 unlock secret drops.

Tag someone taking the red pill or blue pill
below. 👇

#ResistOrEvolve #SporeFall`;

    const encodedUrl = encodeURIComponent(utmUrl);
    const encodedFullText = encodeURIComponent(fullShareText);

    // For Pinterest/Modal: Use a vertical format for Stories/TikTok if possible, or fallback to standard
    // Use the actual pollData.id if available, otherwise use "default"
    const pollIdToUse = effectivePollData?.id || "default";
    const imageUrl = `${window.location.origin}/api/polls/${pollIdToUse}/image?format=png&size=facebook`;
    const encodedImage = encodeURIComponent(imageUrl);

    let shareLink = "";
    // Note: Facebook deprecated the 'quote' parameter and generally ignores pre-filled text in sharer.php.
    // However, we include it as a fallback in case it's supported in some contexts, but 'u' (URL) is the primary parameter.
    const platformMap = {
      FACEBOOK: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedFullText}&hashtag=%23ResistOrEvolve`,
      TWITTER: `https://twitter.com/intent/tweet?text=${encodedFullText}`,
      X_SHARE: `https://twitter.com/intent/tweet?text=${encodedFullText}`,
      LINKEDIN: `https://www.linkedin.com/feed/?shareActive=true&text=${encodedFullText}`,
      WHATSAPP: `https://wa.me/?text=${encodedFullText}`,
      PINTEREST: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedFullText}`,
      TELEGRAM: `https://t.me/share/url?url=${encodedUrl}&text=${encodedFullText}`,
      REDDIT: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedFullText}`,
      DISCORD: `https://discord.com/channels/@me`, // Discord doesn't support direct share URLs, opening app/web
      THREADS: `https://www.threads.net/intent/post?text=${encodedFullText}`,
      TIKTOK: "",
      IG_STORY: "",
    };

    shareLink = platformMap[platformUpper] || "";

    if (platformUpper === "FACEBOOK") {
      // Facebook doesn't support pre-filling text, so we copy it to clipboard for the user
      navigator.clipboard
        .writeText(fullShareText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }

    if (shareLink) {
      console.log("Opening share link:", shareLink);
      window.open(shareLink, "_blank", "noopener,noreferrer,width=600,height=400");
    } else if (platformUpper === "TIKTOK" || platformUpper === "IG_STORY" || platformUpper === "INSTAGRAM") {
      console.log("Opening ShareMediaModal for:", platformUpper);
      setShareModal({
        isOpen: true,
        platform: platformUpper === "IG_STORY" ? "Instagram" : "TikTok",
        imageUrl: imageUrl,
      });
      trackSocialClick(platform);
      return;
    } else {
      console.log("Falling back to clipboard copy");
      copyToClipboard();
    }

    trackSocialClick(platform);
  };

  const copyToClipboard = async () => {
    try {
      const shareUrl = getUTMUrl("direct_copy");

      const fullShareText = `SE Asia’s 1st Gen-AI sci-fi micro-drama just
dropped the pen. ✍️

Spore Fall wants YOU to decide:
✊🏻 Resist
🦅 Evolve

Vote with me before it closes → ${shareUrl}
First 1,000 unlock secret drops.

Tag someone taking the red pill or blue pill
below. 👇

#ResistOrEvolve #SporeFall`;

      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getPollResultProps = () => {
    // Helper to extract name safely
    const getName = (opt, fallback) => {
      if (!opt) return fallback;
      return (opt.text || opt.option_text || opt.name || opt.label || opt.title || fallback).toUpperCase();
    };

    // Helper to extract description safely
    const getDescription = (opt, defaultLabel) => {
      if (!opt) return defaultLabel;
      if (opt.description) return opt.description;
      // Fallback for Evolve/Resist themes only if description is missing
      const name = getName(opt, "").toUpperCase();
      if (name === "EVOLVE" || name === "EVOLUTION") return "TRANSCEND HUMANITY";
      if (name === "RESIST" || name === "RESISTANCE" || name === "CONTAIN") return "BURN THE OLD WORLD";
      return defaultLabel;
    };

    // Handle missing or partial data
    if (!pollData || !pollData.options || pollData.options.length === 0) {
      return {
        faction1: {
          name: "OPTION 1",
          subLabel: "Loading options...",
          percentage: 50,
        },
        faction2: {
          name: "OPTION 2",
          subLabel: "Loading options...",
          percentage: 50,
        },
        centerLabel: "THE CITY STANDS DIVIDED",
      };
    }

    // Dynamic handling: Take first two options, or fallback if only 1 exists
    const option1 = pollData.options[0];
    const option2 = pollData.options[1] || { text: "OPTION 2", votes: 0 };

    const votes1 = option1.votes || option1.vote_count || 0;
    const votes2 = option2.votes || option2.vote_count || 0;
    const totalVotes = votes1 + votes2;

    const percentage1 = totalVotes > 0 ? Math.round((votes1 / totalVotes) * 100) : 50;
    const percentage2 = totalVotes > 0 ? 100 - percentage1 : 50;

    return {
      faction1: {
        name: getName(option1, "OPTION 1"),
        subLabel: getDescription(option1, ""),
        percentage: percentage1,
      },
      faction2: {
        name: getName(option2, "OPTION 2"),
        subLabel: getDescription(option2, ""),
        percentage: percentage2,
      },
      centerLabel: pollData.question || pollData.title || "THE CITY STANDS DIVIDED",
    };
  };

  const getCountdownProps = () => {
    return {
      title: "POLL CLOSES IN",
    };
  };

  if (loading) {
    return <ResultLoader />;
  }

  return (
    <>
      <ResultPage
        pollResultProps={getPollResultProps()}
        countdownProps={getCountdownProps()}
        pollData={pollData}
        onShare={handleShare}
        copied={copied}
        productsProps={{ products }}
        episodesProps={{ episodes }}
        blogProps={{ posts: blogs }}
      />
      <ShareMediaModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ ...shareModal, isOpen: false })}
        platform={shareModal.platform}
        imageUrl={shareModal.imageUrl}
        shareUrl={getUTMUrl(shareModal.platform || "instagram")}
      />
    </>
  );
}
