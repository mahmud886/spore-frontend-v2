"use client";

import { Wrapper } from "@/app/components/shared/Wrapper";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <Wrapper>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
              <XCircle size={100} className="text-red-500 relative z-10" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight"
          >
            PAYMENT <span className="text-red-500">CANCELLED</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-lg mb-10 leading-relaxed"
          >
            Your payment was cancelled. No charges were made. If you had any issues during checkout, please feel free to
            try again or contact our support team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="px-8 py-4 bg-primary text-black font-bold rounded-lg hover:bg-white transition-colors duration-300"
            >
              RETURN HOME
            </Link>
            <Link
              href="/#shop"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              TRY AGAIN
            </Link>
          </motion.div>
        </div>
      </Wrapper>
    </div>
  );
}
