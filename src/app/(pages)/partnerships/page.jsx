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
  const title = "PARTNERSHIPS | SPORE FALL";
  const description =
    "Collaborate with us in building the next generation of sci-fi narrative experiences. Investors, partners, and world-builders welcome.";
  const ogImage = `${base}/api/og?title=${encodeURIComponent("PARTNERSHIPS")}&subtitle=${encodeURIComponent("COLLABORATE WITH US IN BUILDING THE NEXT GENERATION OF SCI-FI NARRATIVE EXPERIENCES.")}`;

  return {
    title,
    description,
    keywords: ["Partnerships", "Investors", "Sci-Fi IP", "Transmedia", "Entertainment Investment"],
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
          alt: "Partner with SPORE FALL - Collaborate with us in building the next generation of sci-fi experiences.",
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
