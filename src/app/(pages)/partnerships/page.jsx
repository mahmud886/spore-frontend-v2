import { ContractOurBusinessTeam } from "@/app/components/parnetships/ContractOurBusinessTeam";
import { InvestorsAndPartners } from "@/app/components/parnetships/InvestorsAndPartners";
import { OurCoreEngine } from "@/app/components/parnetships/OurCoreEngine";
import { PartnerInWorldBuilding } from "@/app/components/parnetships/PartnerInWorldBuilding";
import PartnershipsHeader from "@/app/components/parnetships/PartnershipsHeader";
import { ProofOfConcept } from "@/app/components/parnetships/ProofOfConcept";
import { getBaseUrl } from "@/app/lib/services/base";
import { AnimatedWrapper } from "../../components/shared/AnimatedWrapper";
import { fadeUp } from "../../utils/animations";

export async function generateMetadata() {
  const base = getBaseUrl();
  const title = "PARTNERSHIPS | SPORE FALL | a Sci-Fi Saga";
  const description =
    "Collaborate with us in building the next generation of sci-fi narrative experiences. Join the resistance or embrace the evolution of this Sci-Fi Saga.";
  const ogImage = `${base}/api/og?title=${encodeURIComponent("PARTNERSHIPS")}&subtitle=${encodeURIComponent("COLLABORATE WITH US IN BUILDING THE NEXT GENERATION OF SCI-FI NARRATIVE EXPERIENCES.")}`;

  return {
    title,
    description,
    keywords: [
      // Top Level SEO
      "Spore Fall",
      "Sporefall",
      "The Spore Fall",
      "The Spore",
      "The Sporefall",
      "Spore",
      "Spore Fall Saga",
      "Sporefall Saga",
      "The Spore Saga",
      "The Sporefall Saga",
      "Spore Saga",
      "Spore Fall Chronicles",
      "Sporefall Chronicles",
      "The Spore Chronicles",
      "The Sporefall Chronicles",
      "Spore Chronicles",
      // Partnership specific
      "Partnerships",
      "Investors",
      "Sci-Fi IP",
      "Transmedia",
      "Entertainment Investment",
      "Edenstone Group",
      "Edenstone IP",
      "Scalable intellectual property",
      "IP development platform",
      "De-risking IP development",
      "Community co-creation",
      "Franchise valuation levers",
      "Original IP valuation",
      "Media franchise development",
      "Scalable entertainment franchise",
      "Media and entertainment investment opportunities",
      "AI-enhanced storytelling",
      "AI world-building",
      "Web3 entertainment",
      "Web3 community engagement",
      "Multi-platform narrative",
      "Transmedia IP",
      "Immersive storytelling",
      "Interactive narrative experience",
    ],
    openGraph: {
      title,
      description,
      url: `${base}/partnerships`,
      siteName: "SPORE FALL",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Partner with SPORE FALL - ${description}`,
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

const PartnershipsPage = () => {
  return (
    <>
      <AnimatedWrapper variant={fadeUp} delay={0}>
        <PartnershipsHeader />
      </AnimatedWrapper>
      <AnimatedWrapper variant={fadeUp} delay={0.1}>
        <OurCoreEngine />
      </AnimatedWrapper>
      <AnimatedWrapper variant={fadeUp} delay={0.2}>
        <ProofOfConcept />
      </AnimatedWrapper>
      <AnimatedWrapper variant={fadeUp} delay={0.3}>
        <InvestorsAndPartners />
      </AnimatedWrapper>
      <AnimatedWrapper variant={fadeUp} delay={0.4}>
        <PartnerInWorldBuilding />
      </AnimatedWrapper>
      <AnimatedWrapper variant={fadeUp} delay={0.5}>
        <ContractOurBusinessTeam />
      </AnimatedWrapper>
    </>
  );
};

export default PartnershipsPage;
