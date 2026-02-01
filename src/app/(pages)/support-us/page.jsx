import { SupportHeader } from "@/app/components/support-us/SupportHeader";
import { SupportUsFAQ } from "@/app/components/support-us/SupportUsFAQ";
import { SupportUsTier } from "@/app/components/support-us/SupportUsTier";

export default function SupportUsPage() {
  return (
    <>
      <SupportHeader />
      <SupportUsTier />
      <SupportUsFAQ />
    </>
  );
}
