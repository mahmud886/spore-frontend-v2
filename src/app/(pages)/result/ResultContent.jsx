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
    const imageUrl = `${window.location.origin}/api/polls/${pollData.id}/image?format=png&size=facebook`;
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
    const searchParams = url.searchParams;

    // Set UTM parameters while keeping existing ones (like episode)
    searchParams.set("utm_source", platform.toLowerCase());
    searchParams.set("utm_medium", "social");
    searchParams.set("utm_campaign", "poll_share");

    if (pollData?.id) {
      searchParams.set("utm_content", `poll_${pollData.id}`);
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

    const shareText = `${effectivePollData.question || "Check out this poll"} - Vote now on SPOREFALL.COM`;
    const utmUrl = getUTMUrl(platform);
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(utmUrl);

    // For Pinterest/Modal: Use a vertical format for Stories/TikTok if possible, or fallback to standard
    // Use the actual pollData.id if available, otherwise use "default"
    const pollIdToUse = effectivePollData?.id || "default";
    const imageUrl = `${window.location.origin}/api/polls/${pollIdToUse}/image?format=png&size=facebook`;
    const encodedImage = encodeURIComponent(imageUrl);

    let shareLink = "";
    const platformMap = {
      FACEBOOK: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      TWITTER: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      X_SHARE: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      LINKEDIN: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      WHATSAPP: `https://wa.me/?text=${encodedText}%0A${encodedUrl}`,
      PINTEREST: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedText}`,
      TELEGRAM: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      REDDIT: `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(effectivePollData.question || "Poll Results")}`,
      DISCORD: `https://discord.com/channels/@me`, // Discord doesn't support direct share URLs, opening app/web
      THREADS: `https://www.threads.net/intent/post?text=${encodedText}%20${encodedUrl}`,
      TIKTOK: "",
      IG_STORY: "",
    };

    shareLink = platformMap[platformUpper] || "";

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
      const shareText = `${pollData?.question || "Check out this poll"} - Vote now on SPOREFALL.COM`;
      const shareUrl = getUTMUrl("direct_copy");
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getPollResultProps = () => {
    if (!pollData || !pollData.options || pollData.options.length < 2) {
      return {
        faction1: {
          name: "EVOLVE",
          subLabel: "TRANSCEND HUMANITY",
          percentage: 50,
        },
        faction2: {
          name: "RESIST",
          subLabel: "BURN THE OLD WORLD",
          percentage: 50,
        },
        centerLabel: "THE CITY STANDS DIVIDED",
      };
    }

    const evolveOption = pollData.options?.find((opt) => {
      const name = (opt?.name || opt?.text || "").toUpperCase();
      return name === "EVOLVE" || name === "EVOLUTION";
    });
    const resistOption = pollData.options?.find((opt) => {
      const name = (opt?.name || opt?.text || "").toUpperCase();
      return name === "RESIST" || name === "RESISTANCE" || name === "CONTAIN";
    });

    const option1 = evolveOption || pollData.options[0];
    const option2 = resistOption || pollData.options[1] || pollData.options[0];

    const getSubLabel = (opt, defaultLabel) => {
      if (opt?.description) return opt.description;
      const name = (opt?.name || opt?.text || "").toUpperCase();
      if (name === "EVOLVE" || name === "EVOLUTION") return "TRANSCEND HUMANITY";
      if (name === "RESIST" || name === "RESISTANCE" || name === "CONTAIN") return "BURN THE OLD WORLD";
      return defaultLabel;
    };

    const votes1 = option1.votes || option1.vote_count || 0;
    const votes2 = option2.votes || option2.vote_count || 0;
    const totalVotes = votes1 + votes2;
    const percentage1 = totalVotes > 0 ? Math.round((votes1 / totalVotes) * 100) : 50;
    const percentage2 = totalVotes > 0 ? Math.round((votes2 / totalVotes) * 100) : 50;

    return {
      faction1: {
        name: (option1.text || option1.option_text || "EVOLVE").toUpperCase(),
        subLabel: getSubLabel(option1, "TRANSCEND HUMANITY"),
        percentage: percentage1,
      },
      faction2: {
        name: (option2.text || option2.option_text || "RESIST").toUpperCase(),
        subLabel: getSubLabel(option2, "BURN THE OLD WORLD"),
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
