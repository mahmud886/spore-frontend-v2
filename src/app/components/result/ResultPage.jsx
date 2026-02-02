import NewsletterSection from "../home/NewsletterSection";
import SporeBlogSection from "../shared/SporeBlogSection";
import { Wrapper } from "../shared/Wrapper";
import CountdownSection from "./CountdownSection";
import HeroHeader from "./HeroHeader";
import MobilizeNetworkCard from "./MobilizeNetworkCard";
import PollResultSection from "./PollResultSection";
import ProductsSection from "./ProductsSection";
import { useEffect } from "react";

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
