import { SupportHeader } from "@/app/components/support-us/SupportHeader";
import { SupportUsFAQ } from "@/app/components/support-us/SupportUsFAQ";
import { SupportUsTier } from "@/app/components/support-us/SupportUsTier";
import { getBaseUrl } from "@/app/lib/services/base";

import { AnimatedWrapper } from "../../components/shared/AnimatedWrapper";
import { fadeUp } from "../../utils/animations";

export async function generateMetadata() {
  const base = getBaseUrl();
  const title = "SUPPORT THE UNIVERSE | SPORE FALL";
  const description =
    "Join the Inner Circle. Support the production of Spore Fall and help us bring the universe beyond the screen.";
  const ogImage = `${base}/api/og?title=${encodeURIComponent("SUPPORT THE UNIVERSE")}&subtitle=${encodeURIComponent("JOIN THE INNER CIRCLE. HELP US BRING THE UNIVERSE BEYOND THE SCREEN.")}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${base}/support-us`,
      siteName: "SPORE FALL",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title, type: "image/jpeg" }],
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
