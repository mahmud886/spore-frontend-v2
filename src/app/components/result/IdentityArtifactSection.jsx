"use client";

import IdentityArtifactCard from "./IdentityArtifactCard";
import MobilizeNetworkCard from "./MobilizeNetworkCard";

export default function IdentityArtifactSection({ identityData, mobilizeNetworkProps }) {
  const defaultIdentityData = {
    idRef: "884-XJ",
    codename: "CYHER_01",
    clearance: "L4",
    faction: "Undecided",
    accessMessage: "ACCESS GRANTED. THIS IS YOUR BADGE.",
  };

  const finalIdentityData = identityData || defaultIdentityData;

  return (
    <section className="grid md:grid-cols-2 gap-8 mb-24">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold tracking-widest text-primary uppercase">
          <span className="w-1 h-3 bg-primary"></span>
          <span>Identity Artifact</span>
        </div>
        <IdentityArtifactCard {...finalIdentityData} />
      </div>
      <MobilizeNetworkCard {...mobilizeNetworkProps} />
    </section>
  );
}
