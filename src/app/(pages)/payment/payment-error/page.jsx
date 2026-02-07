"use client";

import { Wrapper } from "@/app/components/shared/Wrapper";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message") || "An unexpected error occurred during the transmission.";

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 bg-black/40 border border-red-500/20 p-8 md:p-12 rounded-lg backdrop-blur-sm relative overflow-hidden group">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-red-500/50" />
      <div className="absolute top-0 right-0 w-2 h-2 bg-red-500/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-red-500/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-500/50" />

      <h1 className="font-heading text-4xl md:text-5xl text-red-500 leading-normal tracking-wider animate-pulse">
        SIGNAL LOST
      </h1>

      <div className="space-y-6">
        <p className="font-body text-xl text-white/90">Transmission Failure</p>
        <p className="font-body text-red-400/80 max-w-lg mx-auto leading-relaxed font-mono text-sm border border-red-500/20 p-4 rounded bg-black/40">
          ERR_CODE: {errorMessage}
        </p>
        <p className="font-body text-gray-400 max-w-lg mx-auto leading-relaxed">
          Please check your connection and try again.
        </p>
      </div>

      <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
        <Link
          href="/"
          className="bg-transparent border border-white/20 text-white font-heading px-8 py-3 rounded hover:bg-white/10 transition-colors duration-300 tracking-widest text-sm"
        >
          RETURN TO BASE
        </Link>
        <Link
          href="/support-us"
          className="bg-red-500 text-black font-heading px-8 py-3 rounded hover:bg-white transition-colors duration-300 tracking-widest text-sm"
        >
          RETRY TRANSMISSION
        </Link>
      </div>
    </div>
  );
}

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
