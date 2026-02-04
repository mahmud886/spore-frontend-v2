import { Wrapper } from "@/app/components/shared/Wrapper";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
      <Wrapper>
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-black/40 border border-primary/20 p-8 md:p-12 rounded-lg backdrop-blur-sm relative overflow-hidden group">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-primary/50" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-primary/50" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary/50" />

          <h1 className="font-heading text-4xl md:text-5xl text-primary leading-normal tracking-wider animate-pulse">
            TRANSMISSION RECEIVED
          </h1>

          <div className="space-y-6">
            <p className="font-body text-xl text-white/90">
              Your contribution has been successfully logged in the network.
            </p>
            <p className="font-body text-gray-400 max-w-lg mx-auto leading-relaxed">
              Thank you for fueling the resistance and helping us expand the Spore Fall universe. Your support keeps the
              signal alive.
            </p>
          </div>

          <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="bg-primary text-black font-heading px-8 py-3 rounded hover:bg-white transition-colors duration-300 tracking-widest text-sm"
            >
              RETURN TO BASE
            </Link>
            <Link
              href="/support-us"
              className="border border-primary/50 text-primary font-heading px-8 py-3 rounded hover:bg-primary/10 transition-colors duration-300 tracking-widest text-sm"
            >
              SUPPORT AGAIN
            </Link>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
