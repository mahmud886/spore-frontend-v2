import { SectionTitle } from "@/app/components/shared/SectionTitle";
import { Wrapper } from "@/app/components/shared/Wrapper";
import { getEpisodeById } from "@/app/lib/services/episodes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PremiereClient from "./PremiereClient";

export default async function PremierePage({ params }) {
  const { id } = await params;

  // Fetch episode details using the service
  const episode = await getEpisodeById(id);

  if (!episode) {
    return (
      <Wrapper>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="mb-4">
            <SectionTitle>Error</SectionTitle>
          </div>
          <p className="text-red-500 mb-8">Episode not found</p>
          <Link
            href="/"
            className="px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-black transition-colors rounded uppercase text-sm font-bold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PremiereClient episode={episode} />
    </Wrapper>
  );
}
