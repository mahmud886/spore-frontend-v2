"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PollMiddlePopup from "../popups/PollMiddlePopup";

export default function ClientPollSection({ poll }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!poll) return null;

  const firstOption = poll.options?.[0];
  const secondOption = poll.options?.[1];
  const firstOptionName = firstOption?.name || firstOption?.text || "EVOLVE";
  const secondOptionName = secondOption?.name || secondOption?.text || "RESIST";
  const firstOptionDescription =
    firstOption?.description || "Transcend humanity. Unlock your latent code. Be something more.";
  const secondOptionDescription =
    secondOption?.description || "Preserve Order. Burn the old world. Rebuild from ashes.";

  const submitVote = async (optionId) => {
    if (isSubmitting) return;
    if (!poll?.episodeId || !optionId) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/polls/episode/${encodeURIComponent(poll.episodeId)}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setIsSubmitting(false);
        return;
      }
      try {
        const votedEpisodes = JSON.parse(localStorage.getItem("sporefall_voted_episodes") || "[]");
        const eidStr = String(poll.episodeId);
        const votedStr = votedEpisodes.map((id) => String(id));
        if (!votedStr.includes(eidStr)) {
          votedEpisodes.push(poll.episodeId);
          localStorage.setItem("sporefall_voted_episodes", JSON.stringify(votedEpisodes));
        }
      } catch {}
      setTimeout(() => {
        router.push(`/result?episode=${encodeURIComponent(poll.episodeId)}`);
      }, 100);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <PollMiddlePopup
      phase={poll.title}
      title={poll.question || poll.description}
      subtitle={
        poll.options?.length
          ? poll.options
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
        if (firstOption?.id) submitVote(firstOption.id);
      }}
      onContainClick={() => {
        if (secondOption?.id) submitVote(secondOption.id);
      }}
      showWaitingMessage={false}
    />
  );
}
