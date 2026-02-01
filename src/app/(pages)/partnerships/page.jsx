import { ContractOurBusinessTeam } from "@/app/components/parnetships/ContractOurBusinessTeam";
import { InvestorsAndPartners } from "@/app/components/parnetships/InvestorsAndPartners";
import { OurCoreEngine } from "@/app/components/parnetships/OurCoreEngine";
import { PartnerInWorldBuilding } from "@/app/components/parnetships/PartnerInWorldBuilding";
import PartnershipsHeader from "@/app/components/parnetships/PartnershipsHeader";
import { ProofOfConcept } from "@/app/components/parnetships/ProofOfConcept";
import { AnimatedWrapper } from "../../components/shared/AnimatedWrapper";
import { fadeUp } from "../../utils/animations";

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
