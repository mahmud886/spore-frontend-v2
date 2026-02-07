import { Wrapper } from "@/app/components/shared/Wrapper";
import { Suspense } from "react";
import ErrorContent from "./ErrorContent";

export const metadata = {
  title: "PAYMENT ERROR | SPORE FALL",
  description: "An error occurred during the payment process. Please try again or contact support.",
  robots: { index: false, follow: true },
};

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
      <Wrapper>
        <Suspense fallback={<div className="text-white text-center">Initializing diagnostics...</div>}>
          <ErrorContent />
        </Suspense>
      </Wrapper>
    </div>
  );
}
