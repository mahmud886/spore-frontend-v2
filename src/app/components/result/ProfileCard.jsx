"use client";

import Image from "next/image";

export default function ProfileCard({
  image = "https://lh3.googleusercontent.com/aida-public/AB6AXuB0qDeLy5D9bP6hKf2MgmfOoz_9i-IRvsXv9lcRcARRm6MPkBQAYM-0Fo5jj6HenXgeoql-UmS0j1YnJ4y1AhPKQ8d0MEVWdAKkNfNl4KEJuvY0Kzsat93csYj1laH0GomuyfjUjMpaOtJ7rk3-k4eCAZs_KMGtKkVFlIxl7Ii5wGeBlkOAS7Ai2wLx6El6JlYhwK3rtrIVw-GALu0BBHwATkkK_EeuIIT4cv4be0V90Ho1A_yJyRH40RCZEh8xtywgcL2IV8xjblc",
  imageAlt = "Character Portrait",
  id = "992-ALPHA",
  factionId = "Evolutionist",
  broadcastCode = "LIO-7F3A",
  syncStatus = "100% Complete",
  position = "Spore Harbinger",
  clearance = "Level 4 OMNI",
  onTellWorld,
  onDownloadId,
}) {
  return (
    <div className="md:col-span-2 relative group border border-primary/30 scanline overflow-hidden">
      <Image
        alt={imageAlt}
        className="w-full h-[500px] object-cover filter grayscale hover:grayscale-0 transition duration-700"
        src={image}
        width={800}
        height={500}
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <div className="absolute top-4 left-4 border border-primary/40 bg-black/60 px-2 py-1">
        <span className="text-[9px] text-primary font-mono uppercase tracking-widest">ID: {id}</span>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="material-symbols-outlined text-primary text-5xl opacity-40 mb-2">fingerprint</span>
        <span className="text-[10px] text-primary tracking-[0.3em] font-bold uppercase">
          Biometric Link Established
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-2xl font-display font-bold text-white uppercase mb-1">Faction ID: {factionId}</h3>
            <p className="text-[10px] text-primary font-mono">BROADCAST CODE: {broadcastCode}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-white/40 uppercase mb-1">Sync Status</p>
            <p className="text-primary font-bold text-xs uppercase">{syncStatus}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-[9px] text-white/40 uppercase">Position</p>
            <p className="text-xs font-bold uppercase">{position}</p>
          </div>
          <div>
            <p className="text-[9px] text-white/40 uppercase">Clearance</p>
            <p className="text-xs font-bold uppercase">{clearance}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="flex-1 bg-primary text-black font-black py-3 text-xs uppercase hover:bg-white transition-colors"
            onClick={onTellWorld}
          >
            Tell the World
          </button>
          <button
            className="flex-1 border border-primary/50 text-primary font-black py-3 text-xs uppercase hover:bg-primary/10 transition-colors"
            onClick={onDownloadId}
          >
            Download ID Card
          </button>
        </div>
      </div>
    </div>
  );
}
