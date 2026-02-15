"use client";

import { Wrapper } from "@/app/components/shared/Wrapper";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
      <Wrapper>
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-black/40 border border-red-500/20 p-8 md:p-12 rounded-lg backdrop-blur-sm relative overflow-hidden group">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-red-500/50" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500/50" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-red-500/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-500/50" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="flex justify-center mb-4"
          >
            <XCircle size={64} className="text-red-500" />
          </motion.div>

          <h1 className="font-heading text-4xl md:text-5xl leading-normal text-red-500 tracking-wider uppercase">
            TRANSMISSION ABORTED
          </h1>

          <div className="space-y-6">
            <p className="font-body text-xl text-white/90">The payment process was cancelled.</p>
            <p className="font-body text-gray-400 max-w-lg mx-auto leading-relaxed">
              Your contribution has not been logged. No charges were made. If you had any issues during checkout, please
              feel free to try again or contact our support team.
            </p>
          </div>

          <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="bg-transparent border border-white/20 text-white font-heading px-8 py-3 rounded hover:bg-white/10 transition-colors duration-300 tracking-widest text-sm w-full md:w-auto text-center"
            >
              RETURN TO BASE
            </Link>
            <Link
              href="/#shop"
              className="bg-red-500 text-black font-heading px-8 py-3 rounded hover:bg-white transition-colors duration-300 tracking-widest text-sm w-full md:w-auto text-center"
            >
              RETRY TRANSMISSION
            </Link>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
