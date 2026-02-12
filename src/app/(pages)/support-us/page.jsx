import { SupportHeader } from "@/app/components/support-us/SupportHeader";
import { SupportUsFAQ } from "@/app/components/support-us/SupportUsFAQ";
import { SupportUsTier } from "@/app/components/support-us/SupportUsTier";
import { getBaseUrl } from "@/app/lib/services/base";

import { AnimatedWrapper } from "../../components/shared/AnimatedWrapper";
import { fadeUp } from "../../utils/animations";

export async function generateMetadata() {
  const base = getBaseUrl();
  const title = "SUPPORT THE UNIVERSE | SPORE FALL | a Sci-Fi Saga";
  const description =
    "A deadly pathogen threatens to overrun the nation city of Lionara. Join the Inner Circle and help us bring this Sci-Fi Saga beyond the screen.";
  const ogImage = `${base}/api/og?title=${encodeURIComponent("SUPPORT THE UNIVERSE")}&subtitle=${encodeURIComponent("A DEADLY PATHOGEN THREATENS TO OVERRUN THE NATION CITY OF LIONARA. JOIN THE INNER CIRCLE.")}`;

  return {
    title,
    description,
    keywords: ["Support Spore Fall", "Inner Circle", "Sci-Fi Community", "World Building", "Patreon Alternative"],
    openGraph: {
      title,
      description,
      url: `${base}/support-us`,
      siteName: "SPORE FALL",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Support SPORE FALL - ${description}`,
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

export default function SupportUsPage() {
  return (
    <>
      <AnimatedWrapper variant={fadeUp} delay={0}>
        <div id="support-header">
          <SupportHeader />
        </div>
      </AnimatedWrapper>
      <AnimatedWrapper variant={fadeUp} delay={0.1}>
        <div id="support-tiers">
          <SupportUsTier />
        </div>
      </AnimatedWrapper>
      <AnimatedWrapper variant={fadeUp} delay={0.2}>
        <div id="support-faq">
          <SupportUsFAQ />
        </div>
      </AnimatedWrapper>
    </>
  );
}
