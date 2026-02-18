"use client";

import { Wrapper } from "@/app/components/shared/Wrapper";
import { useCartStore } from "@/app/lib/store/useCartStore";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isVerifying, setIsVerifying] = useState(!!sessionId);

  useEffect(() => {
    let mounted = true;

    const verifyAndStoreOrder = async () => {
      if (!sessionId) return;
      if (sessionStorage.getItem(`processed_${sessionId}`)) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (response.ok) {
          sessionStorage.setItem(`processed_${sessionId}`, "true");
          const data = await response.json();
          if (mounted) console.log("Post-payment confirmation:", data);
        }
      } catch (err) {
        console.error("Failed to confirm order:", err);
      } finally {
        if (mounted) setIsVerifying(false);
      }
    };

    verifyAndStoreOrder();
    clearCart();

    return () => {
      mounted = false;
    };
  }, [clearCart, sessionId]);

  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-6 md:space-y-8 bg-black/40 border border-primary/20 p-6 md:p-12 rounded-lg backdrop-blur-sm relative overflow-hidden group">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-primary/50" />
      <div className="absolute top-0 right-0 w-2 h-2 bg-primary/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary/50" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="flex justify-center mb-4"
      >
        <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-primary" />
      </motion.div>

      <h1 className="font-heading text-xl sm:text-3xl md:text-5xl text-primary leading-tight tracking-wider animate-pulse uppercase">
        {isVerifying ? "VERIFYING SIGNAL..." : "TRANSMISSION RECEIVED"}
      </h1>

      <div className="space-y-4 md:space-y-6">
        <p className="font-body text-base md:text-xl text-white/90">
          {isVerifying
            ? "Syncing order data with the neural network..."
            : "Your contribution has been successfully logged in the network."}
        </p>
        <p className="font-body text-xs md:text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
          Thank you for fueling the resistance and helping us expand the Spore Fall universe. Your support keeps the
          signal alive.
        </p>
      </div>

      <div className="pt-6 md:pt-8 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
        <Link
          href="/"
          className="bg-primary text-black font-heading px-6 md:px-8 py-3 rounded hover:bg-white transition-colors duration-300 tracking-widest text-xs md:text-sm w-full sm:w-auto text-center"
        >
          RETURN TO BASE
        </Link>
        <Link
          href="/shop"
          className="border border-primary/50 text-primary font-heading px-6 md:px-8 py-3 rounded hover:bg-primary/10 transition-colors duration-300 tracking-widest text-xs md:text-sm w-full sm:w-auto text-center"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
      <Wrapper>
        <Suspense fallback={<div className="text-primary animate-pulse font-mono">CONNECTING TO NETWORK...</div>}>
          <SuccessContent />
        </Suspense>
      </Wrapper>
    </div>
  );
}
