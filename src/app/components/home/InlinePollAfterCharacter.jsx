"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const PollAdModal = dynamic(() => import("../popups/PollAdModal"), { ssr: false });

export default function InlinePollAfterCharacter() {
  const [pollData, setPollData] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchLatestLivePoll = async () => {
      try {
        const res = await fetch("/api/polls?status=LIVE&limit=1");
        if (!res.ok) return;
        const data = await res.json();
        const polls = data.polls || [];
        if (polls.length > 0) {
          const poll = polls[0];
          const options = poll.poll_options || poll.options || [];
          setPollData({
            ...poll,
            options,
            episodeId: poll.episode_id,
          });
        }
      } catch {}
    };
    fetchLatestLivePoll();
  }, []);

  if (!pollData) return null;

  return (
    <section className="pt-12 pb-16 px-8">
      <PollAdModal
        isOpen={isOpen}
        episodeId={pollData?.episodeId}
        pollData={pollData}
        onVoteSuccess={() => {}}
        inline={true}
        inlineAlign="center"
        showBubbleWhenClosed={false}
        showClose={false}
        designVariant="middle"
      />
    </section>
  );
}
