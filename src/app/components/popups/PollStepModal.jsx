"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import NotificationPopup from "./NotificationPopup";
import PollLeftPopup from "./PollLeftPopup";
import PollMiddlePopup from "./PollMiddlePopup";

export default function PollStepModal({
  isOpen,
  onClose,
  autoOpenDelay = 3000,
  episodeId = null,
  pollData = null,
  onVoteSuccess = null,
}) {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: left, 2: middle, 3: right
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [formData, setFormData] = useState({
    codename: "SPECTRE_01",
    faction: "Evolve",
    factionIcon: "microscope",
    designation: "SPECTRE_01",
    episodeId: episodeId,
    pollId: pollData?.id || null,
  });

  const effectiveStep = isOpen ? step : 1;

  const handleLeftNext = (codename) => {
    setFormData((prev) => ({ ...prev, codename, designation: codename }));
    setStep(2);
  };

  const handleMiddleNext = async (faction, optionId = null) => {
    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    const factionData = {
      Evolve: { faction: "Evolve", factionIcon: "biotech" },
      Contain: { faction: "Contain", factionIcon: "shield" },
      Resist: { faction: "Resist", factionIcon: "shield" },
    };
    setFormData((prev) => ({
      ...prev,
      ...(factionData[faction] || {
        faction: "Evolve",
        factionIcon: "biotech",
      }),
    }));

    // Use currentEpisodeId from state (more reliable than prop)
    const episodeIdToUse = episodeId;

    // Validate required data
    if (!episodeIdToUse) {
      setNotificationMessage("Episode ID is missing. Cannot submit vote.");
      setIsNotificationOpen(true);
      return;
    }

    if (!optionId) {
      setNotificationMessage("Poll option is missing. Cannot submit vote.");
      setIsNotificationOpen(true);
      return;
    }

    // Check if poll is not live based on status
    if (pollData?.status && pollData.status.toUpperCase() !== "LIVE") {
      setNotificationMessage("Poll is not live. Voting is closed.");
      setIsNotificationOpen(true);
      return;
    }

    // Submit vote by episode ID - wait for completion before redirecting
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/polls/episode/${encodeURIComponent(episodeIdToUse)}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionId: optionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setNotificationMessage(`Failed to submit vote: ${data.error || data.message || "Unknown error"}`);
        setIsNotificationOpen(true);
        setIsSubmitting(false);
        return; // Don't redirect if vote failed
      }

      // Success! Show notification before redirecting
      setNotificationMessage("Vote recorded. Redirecting to results...");
      setIsNotificationOpen(true);

      // Track voted episode
      try {
        const votedEpisodes = JSON.parse(localStorage.getItem("sporefall_voted_episodes") || "[]");
        const eidStr = String(episodeIdToUse);
        const votedStr = votedEpisodes.map((id) => String(id));
        if (!votedStr.includes(eidStr)) {
          votedEpisodes.push(episodeIdToUse);
          localStorage.setItem("sporefall_voted_episodes", JSON.stringify(votedEpisodes));
        }
        localStorage.removeItem("sporefall_modal_closed");
      } catch (err) {
        console.error("Error saving vote to local storage:", err);
      }

      // Notify parent component about successful vote
      if (onVoteSuccess) {
        onVoteSuccess(episodeIdToUse);
      }

      // Small delay to let user see the success notification
      // We wait slightly longer than the notification animation
      setTimeout(() => {
        if (onClose) onClose();
        router.push(`/result?episode=${encodeURIComponent(episodeIdToUse)}`);
      }, 2500);
    } catch (error) {
      console.error("Error submitting vote:", error);
      setNotificationMessage("Failed to submit vote. Please try again later.");
      setIsNotificationOpen(true);
      setIsSubmitting(false);
    }
  };

  const handleRightComplete = () => {
    setStep(1);
    if (onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    setStep(1);
    try {
      sessionStorage.setItem("sporefall_modal_closed", "true");
    } catch {}
    localStorage.setItem("sporefall_modal_closed", "true");
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen || !pollData) return;
    const nowMs = Date.now();
    let endsMs = null;
    if (pollData.ends_at) {
      endsMs = new Date(pollData.ends_at).getTime();
    } else if (pollData.starts_at && pollData.duration_days) {
      endsMs = new Date(pollData.starts_at).getTime() + pollData.duration_days * 24 * 60 * 60 * 1000;
    }
    const notLive = pollData.status && String(pollData.status).toUpperCase() !== "LIVE";
    const isEnded = notLive || (endsMs && nowMs >= endsMs);
    if (isEnded) {
      if (onClose) onClose();
      setTimeout(() => {
        setNotificationMessage("This episode poll has ended.");
        setIsNotificationOpen(true);
        const eid = pollData.episodeId || episodeId;
        setTimeout(() => {
          if (eid) {
            router.push(`/result?episode=${encodeURIComponent(eid)}`);
          } else {
            router.push("/result");
          }
        }, 5000);
      }, 0);
    }
  }, [isOpen, pollData, episodeId, onClose, router]);

  const isClient = typeof window !== "undefined";
  if (!isClient || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-end p-0 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full h-full flex items-stretch justify-end">
        {/* Step 1: Left Popup */}
        {effectiveStep === 1 && (
          <div className="flex items-center justify-center w-full h-full relative z-10">
            <PollLeftPopup
              codename={formData.codename}
              onInitiateLink={handleLeftNext}
              onClose={handleClose}
              show={true}
            />
          </div>
        )}

        {/* Step 2: Middle Popup */}
        {effectiveStep === 2 &&
          pollData &&
          (() => {
            const pollDataToUse = pollData;
            const options = pollDataToUse?.options || [];
            const firstOption = options[0];
            const secondOption = options[1];

            console.log("PollStepModal - Step 2 - pollDataToUse:", pollDataToUse);
            console.log("PollStepModal - Step 2 - options:", options);
            console.log("PollStepModal - Step 2 - firstOption:", firstOption);
            console.log("PollStepModal - Step 2 - secondOption:", secondOption);
            console.log("PollStepModal - Step 2 - title:", pollDataToUse?.title);
            console.log("PollStepModal - Step 2 - question:", pollDataToUse?.question);

            // Get dynamic option names and descriptions
            const firstOptionName = firstOption?.name || firstOption?.text || "EVOLVE";
            const secondOptionName = secondOption?.name || secondOption?.text || "RESIST";
            const firstOptionDescription =
              firstOption?.description || "Transcend humanity. Unlock your latent code. Be something more.";
            const secondOptionDescription =
              secondOption?.description || "Preserve Order. Burn the old world. Rebuild from ashes.";

            return (
              <div className="flex items-stretch justify-end w-full h-full relative z-10">
                <PollMiddlePopup
                  panelRight
                  phase={pollDataToUse?.title || "Phase 02: Alignment"}
                  title={
                    pollDataToUse?.question ||
                    pollDataToUse?.title ||
                    pollDataToUse?.description ||
                    "Shape The Next Chapter of the Story"
                  }
                  subtitle={
                    options.length > 0
                      ? options
                          .map((opt) => opt?.name || opt?.text || "")
                          .filter(Boolean)
                          .join(" vs ")
                      : "RESIST vs EVOLVE"
                  }
                  firstOptionName={firstOptionName}
                  secondOptionName={secondOptionName}
                  firstOptionDescription={firstOptionDescription}
                  secondOptionDescription={secondOptionDescription}
                  onEvolveClick={() => {
                    if (isSubmitting) return; // Prevent clicks while submitting

                    // Find first option (typically Evolve)
                    if (firstOption && firstOption.id) {
                      handleMiddleNext(firstOptionName, firstOption.id);
                    } else {
                      setNotificationMessage("Poll option not available. Please try again.");
                      setIsNotificationOpen(true);
                    }
                  }}
                  onContainClick={() => {
                    if (isSubmitting) return; // Prevent clicks while submitting

                    // Find second option (typically Resist/Contain)
                    if (secondOption && secondOption.id) {
                      handleMiddleNext(secondOptionName, secondOption.id);
                    } else {
                      setNotificationMessage("Poll option not available. Please try again.");
                      setIsNotificationOpen(true);
                    }
                  }}
                  onClose={handleClose}
                  showWaitingMessage={!isSubmitting}
                />
              </div>
            );
          })()}

        {/* Step 3: Right Popup - Commented out, redirects to result page instead */}
        {/* {step === 3 && (
          <div className="flex items-center justify-center w-full h-full relative z-10">
            <PollRightPopup
              designation={formData.designation}
              faction={formData.faction}
              factionIcon={formData.factionIcon}
              onClose={handleClose}
              onEmailSubmit={(email) => {
                // Email submitted
              }}
              onClaimBadge={handleRightComplete}
              show={true}
            />
          </div>
        )} */}
      </div>
    </div>
  );

  return createPortal(
    <>
      {modalContent}
      <NotificationPopup
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        message={notificationMessage}
        title="System Notification"
        type={notificationMessage.includes("recorded") ? "success" : "error"}
      />
    </>,
    document.body,
  );
}
