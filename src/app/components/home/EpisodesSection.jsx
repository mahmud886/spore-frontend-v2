"use client";

import { ArrowRight, Clock, Lock } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatedCard } from "../shared/AnimatedWrapper";
import Carousel from "../shared/Carousel";
import { SectionTitle } from "../shared/SectionTitle";
import ShimmerCard from "../shared/ShimmerCard";
const NotificationPopup = dynamic(() => import("../popups/NotificationPopup"), { ssr: false });
const PollStepModal = dynamic(() => import("../popups/PollStepModal"), { ssr: false });
const YouTubeModal = dynamic(() => import("../popups/YouTubeModal"), { ssr: false });

export default function EpisodesSection({ episodes: episodesProp = [] }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(null);
  const [pollData, setPollData] = useState(null);
  const [pollLoading, setPollLoading] = useState(false);
  const [hasCheckedFirstVisit, setHasCheckedFirstVisit] = useState(false);
  const [episodesLoaded, setEpisodesLoaded] = useState(false);
  const [votedEpisodes, setVotedEpisodes] = useState([]);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [selectedEpisodeForVideo, setSelectedEpisodeForVideo] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    setEpisodes(Array.isArray(episodesProp) ? episodesProp : []);
    setEpisodesLoaded(true);
    setLoading(false);
    setError(null);
  }, [episodesProp]);

  // Load voted episodes from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sporefall_voted_episodes");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setVotedEpisodes(Array.isArray(parsed) ? parsed : []);
        } catch (err) {
          setVotedEpisodes([]);
        }
      } else {
        setVotedEpisodes([]);
      }
    }
  }, []);

  // Also reload voted episodes when modal closes (in case it was updated elsewhere)
  useEffect(() => {
    if (!isPollModalOpen && typeof window !== "undefined") {
      const stored = localStorage.getItem("sporefall_voted_episodes");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setVotedEpisodes(Array.isArray(parsed) ? parsed : []);
        } catch (err) {
          // Ignore errors
        }
      }
    }
  }, [isPollModalOpen]);

  // Auto-open poll modal for latest episode on page load
  // Opens when episodes are successfully loaded OR after 5 seconds timeout
  // Skips if modal was closed or user already voted
  useEffect(() => {
    if (hasCheckedFirstVisit) {
      return;
    }

    // STEP 1: Check localStorage FIRST - if user has voted, STOP immediately (no modal)
    const checkIfUserVoted = () => {
      try {
        const storedVoted = localStorage.getItem("sporefall_voted_episodes");
        if (storedVoted) {
          const parsedVoted = JSON.parse(storedVoted);
          if (Array.isArray(parsedVoted) && parsedVoted.length > 0) {
            return true; // User has voted
          }
        }
      } catch (err) {
        // If parse fails, assume user hasn't voted (first visit)
      }
      return false; // User hasn't voted
    };

    // If user has voted, don't proceed with ANY modal opening logic
    if (checkIfUserVoted()) {
      setHasCheckedFirstVisit(true);
      return; // Exit immediately - no modal will open
    }

    // STEP 2: Check if modal was closed
    const modalClosed = localStorage.getItem("sporefall_modal_closed");
    if (modalClosed === "true") {
      setHasCheckedFirstVisit(true);
      return;
    }

    // STEP 3: Only if checks pass, proceed with modal opening logic

    // Get current voted episodes from localStorage (most reliable source)
    const getVotedEpisodes = () => {
      try {
        const stored = localStorage.getItem("sporefall_voted_episodes");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((id) => String(id));
          }
        }
      } catch (err) {
        // Ignore parse errors
      }
      return [];
    };

    let timeoutId;
    let hasOpened = false;

    const openLatestEpisodePoll = async () => {
      // Check again before opening (double safety check)
      if (hasOpened || hasCheckedFirstVisit) {
        return;
      }

      // Check localStorage one more time before proceeding
      if (checkIfUserVoted()) {
        setHasCheckedFirstVisit(true);
        return; // User has voted, don't open modal
      }

      // Only proceed if episodes are loaded (or timeout passed)
      if (!episodesLoaded && loading) {
        return;
      }

      // Find the latest available episode (sorted by episode number or release date)
      const availableEpisodes = episodes
        .filter((ep) => ep.status === "available")
        .sort((a, b) => {
          // Sort by episode number if available, otherwise by release date
          if (a.episodeNumber && b.episodeNumber) {
            return b.episodeNumber - a.episodeNumber;
          }
          if (a.releaseDate && b.releaseDate) {
            return new Date(b.releaseDate) - new Date(a.releaseDate);
          }
          return 0;
        });

      if (availableEpisodes.length === 0) {
        setHasCheckedFirstVisit(true);
        return;
      }

      // Get voted episodes list for episode-specific checks
      const getVotedEpisodes = () => {
        try {
          const stored = localStorage.getItem("sporefall_voted_episodes");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed.map((id) => String(id));
            }
          }
        } catch (err) {
          // Ignore parse errors
        }
        return [];
      };

      const currentVotedEpisodes = getVotedEpisodes();

      // Try to find a poll for the latest episode that user hasn't voted on
      for (const episode of availableEpisodes) {
        const episodeIdToUse = episode.id || episode.uniqueEpisodeId;
        if (!episodeIdToUse) continue;

        // Check localStorage again for this specific episode
        const episodeIdStr = String(episodeIdToUse);
        if (currentVotedEpisodes.includes(episodeIdStr)) {
          continue; // User has voted on this episode, try next
        }

        try {
          const response = await fetch(`/api/polls/episode/${encodeURIComponent(episodeIdToUse)}`);

          if (!response.ok) {
            continue;
          }

          const data = await response.json();

          if (data.polls && data.polls.length > 0) {
            // Find LIVE poll or use first poll
            const activePoll = data.polls.find((p) => p.status === "LIVE") || data.polls[0];

            // Map poll data - use same structure as API response
            const mappedPollData = {
              ...activePoll, // Spread all fields from API response
              id: activePoll.id,
              episode_id: activePoll.episodeId,
              episodeId: activePoll.episodeId,
              title: activePoll.title || activePoll.question || "Poll",
              question: activePoll.question || activePoll.title || "Make your choice",
              description: activePoll.description || activePoll.question || "Make your choice",
              status: activePoll.status || "LIVE",
              // Keep options as-is from API (already in correct format)
              options: activePoll.options || [],
            };

            // Final localStorage check before opening modal
            // Check one more time to prevent race conditions
            const episodeIdStrFinal = String(episodeIdToUse);

            // Final check: if user has voted (any episode), don't open modal
            if (checkIfUserVoted()) {
              setHasCheckedFirstVisit(true);
              return; // User has voted, don't open modal
            }

            // Double-check this specific episode hasn't been voted on
            const finalVotedCheck = getVotedEpisodes();
            if (finalVotedCheck.includes(episodeIdStrFinal)) {
              continue; // User has voted on this specific episode, try next
            }

            // All localStorage checks passed - user hasn't voted, safe to open modal
            setPollData(mappedPollData);
            setSelectedEpisodeId(episodeIdToUse);
            setIsPollModalOpen(true);
            setHasCheckedFirstVisit(true);
            hasOpened = true;
            return; // Exit after finding first poll
          }
        } catch (err) {
          continue; // Try next episode
        }
      }

      // If we get here, user has voted on all available episodes or no polls found
      setHasCheckedFirstVisit(true);
    };

    // If episodes are already loaded, open immediately
    if (episodesLoaded && episodes.length > 0 && !loading) {
      openLatestEpisodePoll();
    }

    // Set 5-second timeout as fallback
    timeoutId = setTimeout(() => {
      if (!hasCheckedFirstVisit && !hasOpened) {
        setEpisodesLoaded(true); // Force episodes as loaded after timeout
        if (episodes.length > 0) {
          openLatestEpisodePoll();
        } else {
          setHasCheckedFirstVisit(true);
        }
      }
    }, 5000);

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [episodes, loading, hasCheckedFirstVisit, episodesLoaded, votedEpisodes]);

  // Fetch poll data when episode is selected
  useEffect(() => {
    const fetchPoll = async () => {
      if (!selectedEpisodeId) {
        return;
      }

      // Check if user has already voted on this episode
      const selectedEpisodeIdStr = String(selectedEpisodeId);
      const votedEpisodesStr = votedEpisodes.map((id) => String(id));

      if (votedEpisodesStr.includes(selectedEpisodeIdStr)) {
        // User already voted, don't open modal
        setSelectedEpisodeId(null);
        setPollLoading(false);
        setNotificationMessage("You have already voted on this episode.");
        setIsNotificationOpen(true);
        return;
      }

      try {
        setPollLoading(true);
        // Use the new episode-specific API route
        const url = `/api/polls/episode/${encodeURIComponent(selectedEpisodeId)}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch poll");
        }

        const data = await response.json();

        // Get the first poll for this episode (or filter by status if needed)
        if (data.polls && data.polls.length > 0) {
          // Filter for LIVE polls first, or take the first one
          const activePoll = data.polls.find((p) => p.status === "LIVE") || data.polls[0];

          // Map to the format expected by PollStepModal - use same structure as API response
          const mappedPollData = {
            ...activePoll, // Spread all fields from API response
            id: activePoll.id,
            episode_id: activePoll.episodeId,
            episodeId: activePoll.episodeId,
            title: activePoll.title || activePoll.question || "Poll",
            question: activePoll.question || activePoll.title || "Make your choice",
            description: activePoll.description || activePoll.question || "Make your choice",
            status: activePoll.status || "LIVE",
            // Keep options as-is from API (already in correct format)
            options: activePoll.options || [],
          };

          // Open the modal only if user hasn't voted
          setPollData(mappedPollData);
          setIsPollModalOpen(true);
        } else {
          // Reset selection if no poll found
          setSelectedEpisodeId(null);
          setNotificationMessage("No poll available for this episode.");
          setIsNotificationOpen(true);
        }
      } catch (err) {
        setSelectedEpisodeId(null);
        setNotificationMessage(`Error loading poll: ${err.message}`);
        setIsNotificationOpen(true);
      } finally {
        setPollLoading(false);
      }
    };

    fetchPoll();
  }, [selectedEpisodeId, votedEpisodes]);

  const handleWatchNow = (episodeId) => {
    // Validate episode ID
    if (!episodeId || episodeId === null || episodeId === undefined) {
      setNotificationMessage("Episode ID is missing. Cannot open poll.");
      setIsNotificationOpen(true);
      return;
    }

    // Convert to string if it's an object (might be an object with toString)
    let episodeIdToSet = episodeId;
    if (typeof episodeId === "object" && episodeId !== null) {
      episodeIdToSet = episodeId.toString();
    }

    // Set the episode ID to trigger poll fetch
    setSelectedEpisodeId(episodeIdToSet);
  };

  const handleCloseModal = () => {
    setIsPollModalOpen(false);
    setSelectedEpisodeId(null);
    setPollData(null);
    // Mark modal as closed in localStorage so it doesn't auto-open again
    localStorage.setItem("sporefall_modal_closed", "true");
    // Reset hasCheckedFirstVisit so modal can auto-open again on next page load
    setHasCheckedFirstVisit(false);
  };

  const handleWatchNowClick = (episode) => {
    // Check if episode has a videoUrl
    if (episode.videoUrl) {
      // Open YouTube modal
      setSelectedEpisodeForVideo(episode);
      setIsYouTubeModalOpen(true);
    } else {
      // Show notification popup if no video available
      setNotificationMessage("There is no episode video available.");
      setIsNotificationOpen(true);
    }
  };

  const handleCloseYouTubeModal = () => {
    setIsYouTubeModalOpen(false);
    setSelectedEpisodeForVideo(null);
  };

  const handleCloseNotification = () => {
    setIsNotificationOpen(false);
    setNotificationMessage("");
  };

  // Update the poll fetch error handling to use notification popup
  useEffect(() => {
    const fetchPoll = async () => {
      if (!selectedEpisodeId) {
        return;
      }

      // Check if user has already voted on this episode
      const selectedEpisodeIdStr = String(selectedEpisodeId);
      const votedEpisodesStr = votedEpisodes.map((id) => String(id));

      if (votedEpisodesStr.includes(selectedEpisodeIdStr)) {
        // User already voted, don't open modal
        setSelectedEpisodeId(null);
        setPollLoading(false);
        setNotificationMessage("You have already voted on this episode.");
        setIsNotificationOpen(true);
        return;
      }

      try {
        setPollLoading(true);
        // Use the new episode-specific API route
        const url = `/api/polls/episode/${encodeURIComponent(selectedEpisodeId)}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch poll");
        }

        const data = await response.json();

        // Get the first poll for this episode (or filter by status if needed)
        if (data.polls && data.polls.length > 0) {
          // Filter for LIVE polls first, or take the first one
          const activePoll = data.polls.find((p) => p.status === "LIVE") || data.polls[0];

          // Map to the format expected by PollStepModal - use same structure as API response
          const mappedPollData = {
            ...activePoll, // Spread all fields from API response
            id: activePoll.id,
            episode_id: activePoll.episodeId,
            episodeId: activePoll.episodeId,
            title: activePoll.title || activePoll.question || "Poll",
            question: activePoll.question || activePoll.title || "Make your choice",
            description: activePoll.description || activePoll.question || "Make your choice",
            status: activePoll.status || "LIVE",
            // Keep options as-is from API (already in correct format)
            options: activePoll.options || [],
          };

          // Open the modal only if user hasn't voted
          setPollData(mappedPollData);
          setIsPollModalOpen(true);
        } else {
          // Reset selection if no poll found
          setSelectedEpisodeId(null);
          setNotificationMessage("No poll available for this episode.");
          setIsNotificationOpen(true);
        }
      } catch (err) {
        setSelectedEpisodeId(null);
        setNotificationMessage(`Error loading poll: ${err.message}`);
        setIsNotificationOpen(true);
      } finally {
        setPollLoading(false);
      }
    };

    fetchPoll();
  }, [selectedEpisodeId, votedEpisodes]);
  const renderEpisodeCard = (episode) => (
    <AnimatedCard key={episode.id || `episode-${episode.episodeNumber}`} hoverGlow={true} hoverFloat={true}>
      <div
        className={`group overflow-hidden transition-all duration-300 h-full flex flex-col box-shadow-xl border border-transparent ${
          episode.status === "available"
            ? "hover:border-primary"
            : episode.status === "upcoming"
              ? "hover:border-orange-600"
              : "hover:border-gray-700"
        }`}
        style={{
          borderTopRightRadius: "20px",
          borderBottomLeftRadius: "20px",
        }}
      >
        {/* Image Section */}
        <div
          className="relative overflow-hidden w-full aspect-[326/222] cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleWatchNowClick(episode);
          }}
        >
          <Image
            alt={episode.title}
            className={`object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ${
              episode.status === "locked" ? "grayscale" : episode.status === "upcoming" ? "grayscale" : ""
            }`}
            src={episode.thumbnail}
            width={648}
            height={444}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            quality={70}
          />
          {episode.status === "available" && (
            <span className="absolute top-2 left-2 bg-black text-white text-[8px] font-bold px-2 py-0.5 uppercase flex items-center gap-1.5 rounded">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Available
            </span>
          )}
          {episode.status === "upcoming" && (
            <span className="absolute top-2 left-2 bg-orange-600 text-white text-[8px] font-bold px-2 py-0.5 uppercase flex items-center gap-1 rounded">
              <Clock className="w-2 h-2" />
              <span>Upcoming</span>
            </span>
          )}
          {episode.status === "locked" && (
            <span className="absolute top-2 left-2 bg-gray-700 text-white text-[8px] font-bold px-2 py-0.5 uppercase flex items-center gap-1 rounded">
              <Lock className="w-2 h-2" />
              <span>Locked</span>
            </span>
          )}
        </div>

        {/* Text/Info Section */}
        <div
          className={`p-4 space-y-3 transition-all duration-300 flex-1 flex flex-col ${
            episode.status === "available"
              ? "bg-black/50 group-hover:bg-primary"
              : episode.status === "upcoming"
                ? "bg-black/50 group-hover:bg-orange-600"
                : "bg-black/50 group-hover:bg-gray-700"
          }`}
        >
          <h4
            className={`text-[16px] font-display font-bold uppercase mb-2 tracking-wide transition-colors duration-300 ${
              episode.status === "available"
                ? "text-white group-hover:text-black"
                : episode.status === "upcoming"
                  ? "text-white group-hover:text-black"
                  : episode.status === "locked"
                    ? "text-white/40 group-hover:text-white"
                    : "text-white"
            }`}
          >
            {episode.title}
          </h4>
          <p
            className={`text-[12px] leading-relaxed mb-4 mr-4 flex-1 transition-colors duration-300 ${
              episode.status === "available"
                ? "text-white/70 group-hover:text-black"
                : episode.status === "upcoming"
                  ? "text-white/70 group-hover:text-black"
                  : episode.status === "locked"
                    ? "text-white/30 group-hover:text-white/60"
                    : "text-white/70"
            }`}
          >
            {episode.description}
          </p>
          <div className="flex items-center justify-between pb-2">
            <span
              className={`text-[10px] uppercase tracking-widest transition-colors duration-300 ${
                episode.status === "available"
                  ? "text-white/50 group-hover:text-black/60"
                  : episode.status === "upcoming"
                    ? "text-white/50 group-hover:text-black/60"
                    : episode.status === "locked"
                      ? "text-white/20 group-hover:text-white/40"
                      : "text-white/50"
              }`}
            >
              {episode.status === "upcoming" || episode.status === "locked" ? "Est. " : ""}
              Runtime: {episode.runtime}
            </span>
            {episode.status === "available" && (
              <div className="flex items-center gap-2">
                {/* Vote Button */}
                {(() => {
                  const episodeIdToUse = episode.id || episode.uniqueEpisodeId;
                  // Convert to string for consistent comparison
                  const episodeIdStr = episodeIdToUse ? String(episodeIdToUse) : null;
                  // Use state for voted episodes (more reactive) - convert all to strings for comparison
                  const votedEpisodesStr = votedEpisodes.map((id) => String(id));
                  const hasVoted = episodeIdStr && votedEpisodesStr.includes(episodeIdStr);

                  return (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (!episodeIdToUse) {
                          setNotificationMessage("Episode ID is missing. Cannot open poll.");
                          setIsNotificationOpen(true);
                          return;
                        }

                        // If user already voted, show message instead of opening modal
                        if (hasVoted) {
                          setNotificationMessage("You have already voted on this episode.");
                          setIsNotificationOpen(true);
                          return;
                        }

                        // Open poll modal only if not voted
                        handleWatchNow(episodeIdToUse);
                      }}
                      disabled={pollLoading || hasVoted}
                      className={`cursor-pointer border text-[9px] font-bold px-3 py-1.5 uppercase flex items-center gap-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        hasVoted
                          ? "border-gray-500 text-gray-400 cursor-pointer"
                          : "border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:border-cyan-500 hover:text-black"
                      }`}
                      style={{
                        borderTopRightRadius: "4px",
                        borderBottomLeftRadius: "4px",
                      }}
                    >
                      {pollLoading && selectedEpisodeId === episodeIdToUse ? (
                        <>Loading...</>
                      ) : hasVoted ? (
                        <>Voted</>
                      ) : (
                        <>Vote</>
                      )}
                    </button>
                  );
                })()}
                {/* Watch Now Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleWatchNowClick(episode);
                  }}
                  disabled={pollLoading}
                  className="border border-primary text-white text-[9px] font-bold px-3 py-1.5 uppercase flex items-center gap-1 transition-all duration-300 group-hover:bg-white group-hover:border-white group-hover:text-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    borderTopRightRadius: "4px",
                    borderBottomLeftRadius: "4px",
                  }}
                >
                  {pollLoading && selectedEpisodeId === (episode.id || episode.uniqueEpisodeId) ? (
                    <>Loading...</>
                  ) : (
                    <>
                      Watch Now <ArrowRight className="w-3 h-3 group-hover:text-black" />
                    </>
                  )}
                </button>
              </div>
            )}
            {episode.status === "upcoming" && (
              <button
                className="border border-orange-600 text-orange-600 text-[9px] font-bold px-3 py-1.5 uppercase flex items-center gap-1 transition-all duration-300 group-hover:bg-white group-hover:border-white group-hover:text-black"
                style={{
                  borderTopRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                }}
              >
                <ArrowRight className="w-3 h-3 group-hover:text-black" /> Notify Me
              </button>
            )}
            {episode.status === "locked" && (
              <button
                className="border border-white/20 text-white/30 text-[9px] font-bold px-3 py-1.5 uppercase transition-all duration-300 group-hover:bg-white group-hover:border-white group-hover:text-black"
                style={{
                  borderTopRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                }}
              >
                Locked
              </button>
            )}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );

  if (loading) {
    return (
      <section className="py-24 px-8 cyber-hex-grid">
        <div className="mb-8">
          <SectionTitle>Episodes</SectionTitle>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {[...Array(4)].map((_, index) => (
            <ShimmerCard key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-8 cyber-hex-grid">
        <div className="text-center py-20">
          <p className="text-red-500 mb-2">Error loading episodes</p>
          <p className="text-white/60 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  if (episodes.length === 0) {
    return (
      <section className="py-24 px-8 cyber-hex-grid">
        <div className="text-center py-20">
          <p className="text-white/60 text-sm">No episodes available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-24 px-8 cyber-hex-grid">
        <Carousel
          items={episodes}
          renderItem={renderEpisodeCard}
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
          gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
          titleComponent={<SectionTitle>Episodes</SectionTitle>}
        />
      </section>
      {/* Poll Modal - Opens when available episode is clicked */}
      <PollStepModal
        isOpen={isPollModalOpen && !!pollData}
        onClose={handleCloseModal}
        autoOpenDelay={0}
        episodeId={selectedEpisodeId}
        pollData={pollData}
        onVoteSuccess={(episodeId) => {
          // Update voted episodes state when vote is successful
          if (episodeId) {
            const episodeIdStr = String(episodeId);
            const votedEpisodesStr = votedEpisodes.map((id) => String(id));

            if (!votedEpisodesStr.includes(episodeIdStr)) {
              const updated = [...votedEpisodes, episodeId];
              setVotedEpisodes(updated);
              // Also update localStorage
              localStorage.setItem("sporefall_voted_episodes", JSON.stringify(updated));
            }
          }
        }}
      />
      {/* YouTube Modal - Opens when Watch Now button is clicked for episodes with videoUrl */}
      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={handleCloseYouTubeModal}
        videoUrl={selectedEpisodeForVideo?.videoUrl}
        title={selectedEpisodeForVideo?.title || "Watch Episode"}
      />
      {/* Notification Popup - Shows various messages including no poll available */}
      <NotificationPopup
        isOpen={isNotificationOpen}
        onClose={handleCloseNotification}
        message={notificationMessage}
        title="Notice"
      />
    </>
  );
}
