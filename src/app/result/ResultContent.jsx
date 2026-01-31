"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResultPage from "../components/result/ResultPage";
import { trackEvent } from "../components/shared/Analytics";

export default function ResultContent({ products: products = [] }) {
  const searchParams = useSearchParams();
  const episodeId = searchParams.get("episode");
  const pollIdParam = searchParams.get("poll") || searchParams.get("pollId");

  // Extract poll ID from utm_content if present (format: poll_<poll_id>)
  const utmContent = searchParams.get("utm_content");
  const pollIdFromUtm = utmContent && utmContent.startsWith("poll_") ? utmContent.replace("poll_", "") : null;

  // Use pollId from param, utm_content, or null
  const pollId = pollIdParam || pollIdFromUtm;

  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(!!episodeId || !!pollId);
  const [copied, setCopied] = useState(false);

  console.log("ResultContent - URL params:", {
    episodeId,
    pollIdParam,
    utmContent,
    pollIdFromUtm,
    pollId,
  });

  // Fetch poll data by poll ID (direct) or episode ID
  useEffect(() => {
    // If we have a poll ID, fetch directly
    if (pollId) {
      console.log("Fetching poll by ID:", pollId);
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
            // Map poll_options to options for consistency
            const poll = {
              ...data.poll,
              options: data.poll.options || data.poll.poll_options || [],
            };
            console.log("Fetched poll by ID:", poll);
            console.log("Poll options:", poll.options);
            setPollData(poll);
          }
        } catch (error) {
          console.error("Error fetching poll by ID:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPollById();
      return;
    }

    // Otherwise, fetch by episode ID (existing logic)
    if (!episodeId) {
      setLoading(false);
      return;
    }

    console.log("Fetching poll by episode ID:", episodeId);

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
          // Get the first LIVE poll or the first poll
          const poll = data.polls.find((p) => p.status === "LIVE") || data.polls[0];
          if (poll && poll.id) {
            setPollData(poll);
          }
        }
      } catch (error) {
        console.error("Error fetching poll data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, [episodeId, pollId]);

  // Update meta tags dynamically for social sharing
  useEffect(() => {
    if (typeof window === "undefined" || !pollData || !pollData.id) {
      return;
    }

    const totalVotes = (pollData.options || []).reduce((sum, opt) => sum + (opt.votes || opt.vote_count || 0), 0);
    const imageUrl = `${window.location.origin}/api/polls/${pollData.id}/image`;
    const shareUrl = window.location.href.split("?")[0];

    // Verify image URL is accessible (for debugging)
    if (process.env.NODE_ENV === "development") {
      fetch(imageUrl)
        .then((res) => {
          if (!res.ok) {
            console.warn("OG image route returned error:", res.status, res.statusText);
          }
        })
        .catch((err) => {
          console.warn("OG image route error:", err);
        });
    }

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

    // Open Graph tags for Facebook, LinkedIn, WhatsApp
    const pollTitle = pollData.question || pollData.title || "Poll Results";
    updateMetaTag("og:title", pollTitle);
    updateMetaTag("og:description", `Poll Results - ${totalVotes} total votes`);
    updateMetaTag("og:image", imageUrl);
    updateMetaTag("og:image:width", "1200");
    updateMetaTag("og:image:height", "630");
    updateMetaTag("og:url", shareUrl);
    updateMetaTag("og:type", "website");
    updateMetaTag("og:image:type", "image/svg+xml");

    // Twitter Card tags
    updateNameTag("twitter:card", "summary_large_image");
    updateNameTag("twitter:title", pollTitle);
    updateNameTag("twitter:description", `Poll Results - ${totalVotes} total votes`);
    updateNameTag("twitter:image", imageUrl);
  }, [pollData]);

  // Handle hash navigation on page load
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

  // Track social media clicks
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
    } catch (error) {
      // Error tracking social click
    }
  };

  // Generate URL with UTM parameters
  const getUTMUrl = (platform) => {
    if (typeof window === "undefined" || !pollData) return "";
    const baseUrl = window.location.href.split("?")[0];
    const utmParams = new URLSearchParams({
      utm_source: platform.toLowerCase(),
      utm_medium: "social",
      utm_campaign: "poll_share",
      utm_content: `poll_${pollData.id}`,
    });
    return `${baseUrl}?${utmParams.toString()}`;
  };

  // Handle social sharing
  const handleShare = async (platform) => {
    if (!pollData) return;

    await trackSocialClick(platform);

    const shareText = `${pollData.question || "Check out this poll"} - Vote now on SPOREFALL.COM`;
    const utmUrl = getUTMUrl(platform);
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(utmUrl);
    const imageUrl = `${window.location.origin}/api/polls/${pollData.id}/image`;
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
      REDDIT: `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(pollData.question || "Poll Results")}`,
      DISCORD: "", // Discord doesn't have a direct share URL
      THREADS: "", // Threads doesn't have a direct share URL
      TIKTOK: "", // TikTok requires app
      IG_STORY: "", // Instagram Stories requires app
    };

    shareLink = platformMap[platform.toUpperCase()] || "";

    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400");
    } else if (platform.toUpperCase() === "TIKTOK" || platform.toUpperCase() === "IG_STORY") {
      // Copy to clipboard for apps that don't support web sharing
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${utmUrl}`);
        alert(`Link copied! Open ${platform} app to share.`);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard();
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!pollData) return;
    try {
      const shareText = `${pollData.question || "Check out this poll"} - Vote now on SPOREFALL.COM`;
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Failed to copy
    }
  };

  // Calculate poll result props from pollData
  const getPollResultProps = () => {
    if (!pollData || !pollData.options || pollData.options.length < 2) {
      // Default props if no poll data
      return {
        faction1: {
          name: "EVOLVE",
          subLabel: "BASTION PARTY",
          percentage: 50,
        },
        faction2: {
          name: "RESIST",
          subLabel: "THE NEW ALLIANCE",
          percentage: 50,
        },
        centerLabel: "THE CITY STANDS DIVIDED",
      };
    }

    const option1 = pollData.options[0];
    const option2 = pollData.options[1];

    const votes1 = option1.votes || option1.vote_count || 0;
    const votes2 = option2.votes || option2.vote_count || 0;
    const totalVotes = votes1 + votes2;

    const percentage1 = totalVotes > 0 ? Math.round((votes1 / totalVotes) * 100) : 50;
    const percentage2 = totalVotes > 0 ? Math.round((votes2 / totalVotes) * 100) : 50;

    return {
      faction1: {
        name: (option1.text || option1.option_text || "EVOLVE").toUpperCase(),
        subLabel: option1.description || "BASTION PARTY",
        percentage: percentage1,
      },
      faction2: {
        name: (option2.text || option2.option_text || "RESIST").toUpperCase(),
        subLabel: option2.description || "THE NEW ALLIANCE",
        percentage: percentage2,
      },
      centerLabel: pollData.question || pollData.title || "THE CITY STANDS DIVIDED",
    };
  };

  // Get countdown props from poll data
  const getCountdownProps = () => {
    return {
      title: "POLL CLOSES IN",
    };
  };

  // console.log("ResultContent - pollData before passing:", pollData);

  return (
    <ResultPage
      pollResultProps={getPollResultProps()}
      countdownProps={getCountdownProps()}
      pollData={pollData}
      onShare={handleShare}
      copied={copied}
      productsProps={{ products }}
    />
  );
}
