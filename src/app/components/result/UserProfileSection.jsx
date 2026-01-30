"use client";

import ProfileCard from "./ProfileCard";
import TacticalDirective from "./TacticalDirective";

const defaultProfileData = {
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB0qDeLy5D9bP6hKf2MgmfOoz_9i-IRvsXv9lcRcARRm6MPkBQAYM-0Fo5jj6HenXgeoql-UmS0j1YnJ4y1AhPKQ8d0MEVWdAKkNfNl4KEJuvY0Kzsat93csYj1laH0GomuyfjUjMpaOtJ7rk3-k4eCAZs_KMGtKkVFlIxl7Ii5wGeBlkOAS7Ai2wLx6El6JlYhwK3rtrIVw-GALu0BBHwATkkK_EeuIIT4cv4be0V90Ho1A_yJyRH40RCZEh8xtywgcL2IV8xjblc",
  imageAlt: "Character Portrait",
  id: "992-ALPHA",
  factionId: "Evolutionist",
  broadcastCode: "LIO-7F3A",
  syncStatus: "100% Complete",
  position: "Spore Harbinger",
  clearance: "Level 4 OMNI",
};

export default function UserProfileSection({
  profileData,
  onTellWorld,
  onDownloadId,
  showTacticalDirective = true,
  tacticalDirectiveProps,
}) {
  const finalProfileData = profileData || defaultProfileData;

  return (
    <section className="grid md:grid-cols-3 gap-8 mb-24">
      <ProfileCard {...finalProfileData} onTellWorld={onTellWorld} onDownloadId={onDownloadId} />
      {showTacticalDirective && <TacticalDirective {...tacticalDirectiveProps} />}
    </section>
  );
}
