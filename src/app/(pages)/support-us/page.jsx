import { SupportHeader } from "@/app/components/support-us/SupportHeader";
import { SupportUsFAQ } from "@/app/components/support-us/SupportUsFAQ";
import { SupportUsTier } from "@/app/components/support-us/SupportUsTier";

import { AnimatedWrapper } from "../../components/shared/AnimatedWrapper";
import { fadeUp } from "../../utils/animations";

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
