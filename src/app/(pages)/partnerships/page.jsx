import { ContractOurBusinessTeam } from "@/app/components/parnetships/ContractOurBusinessTeam";
import { InvestorsAndPartners } from "@/app/components/parnetships/InvestorsAndPartners";
import { OurCoreEngine } from "@/app/components/parnetships/OurCoreEngine";
import { PartnerInWorldBuilding } from "@/app/components/parnetships/PartnerInWorldBuilding";
import PartnershipsHeader from "@/app/components/parnetships/PartnershipsHeader";
import { ProofOfConcept } from "@/app/components/parnetships/ProofOfConcept";

const PartnershipsPage = () => {
  return (
    <>
      <PartnershipsHeader />
      <OurCoreEngine />
      <ProofOfConcept />
      <InvestorsAndPartners />
      <PartnerInWorldBuilding />
      <ContractOurBusinessTeam />
    </>
  );
};

export default PartnershipsPage;
