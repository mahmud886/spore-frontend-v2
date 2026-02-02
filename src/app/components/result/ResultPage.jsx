import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import NewsletterSection from "../home/NewsletterSection";
import SporeBlogSection from "../shared/SporeBlogSection";
import { Wrapper } from "../shared/Wrapper";
import CountdownSection from "./CountdownSection";
import HeroHeader from "./HeroHeader";
import MobilizeNetworkCard from "./MobilizeNetworkCard";
import PollResultSection from "./PollResultSection";
import ProductsSection from "./ProductsSection";
const PollAdModal = dynamic(() => import("../popups/PollAdModal"), { ssr: false });

export default function ResultPage({
  heroHeaderProps,
  countdownProps,
  pollResultProps = {
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
  },
  identityArtifactProps,
  userProfileProps,
  productsProps,
  blogProps,
  pollData,
  onShare,
  copied,
}) {
  const [pollInlineData, setPollInlineData] = useState(null);
  const [isPollInlineOpen, setIsPollInlineOpen] = useState(true);

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
          setPollInlineData({
            ...poll,
            options,
            episodeId: poll.episode_id,
          });
        }
      } catch {}
    };
    fetchLatestLivePoll();
  }, []);
  return (
    <>
      <Wrapper>
        <div id="home">
          <HeroHeader {...heroHeaderProps} />
        </div>

        <PollResultSection {...pollResultProps} />
        <CountdownSection title={countdownProps?.title || "POLL CLOSES IN"} pollData={pollData} />
        <MobilizeNetworkCard
          title="Share to unlock the next drop"
          description="Broadcast this signal. A hidden reward unlocks at the end."
          platforms={[
            "FACEBOOK",
            "WHATSAPP",
            "DISCORD",
            "TELEGRAM",
            "LINKEDIN",
            "X_SHARE",
            "THREADS",
            "TIKTOK",
            "IG_STORY",
            "REDDIT",
          ]}
          onShare={onShare}
          copied={copied}
        />
        {/* <IdentityArtifactSection {...identityArtifactProps} /> */}
        {/* <UserProfileSection {...userProfileProps} /> */}
        <NewsletterSection />
        {pollInlineData && (
          <section className="pt-12 pb-16 px-8">
            <PollAdModal
              isOpen={isPollInlineOpen}
              episodeId={pollInlineData?.episodeId}
              pollData={pollInlineData}
              onVoteSuccess={() => {}}
              inline={true}
              inlineAlign="center"
              showClose={false}
              designVariant="middle"
            />
          </section>
        )}
        <div id="shop" className="pt-24">
          <ProductsSection {...productsProps} />
        </div>
        <div id="spore-log">
          <SporeBlogSection {...blogProps} />
        </div>
      </Wrapper>
    </>
  );
}
