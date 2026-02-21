"use client";

import { SectionTitle } from "@/app/components/shared/SectionTitle";
import { ArrowLeft, Loader, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PremiereClient({ episode }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    // Check if already unlocked in localStorage
    if (episode?.id) {
      const unlocked = localStorage.getItem(`premiere_unlocked_${episode.id}`);
      if (unlocked === "true") {
        setIsUnlocked(true);
      }
    }
  }, [episode?.id]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setVerifyError("");

    try {
      const res = await fetch("/api/episodes/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: episode.id, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsUnlocked(true);
        localStorage.setItem(`premiere_unlocked_${episode.id}`, "true");
      } else {
        setVerifyError(data.error || "Incorrect password");
      }
    } catch (err) {
      setVerifyError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(episode.videoUrl ? episode.videoUrl.trim() : "");

  return (
    <div className="min-h-screen py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      <button
        onClick={() => router.push("/")}
        className="mb-8 text-white/60 hover:text-white flex items-center gap-2 transition-colors text-sm uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="flex flex-col gap-8">
        <div className="text-center md:text-left">
          <SectionTitle>{episode.title}</SectionTitle>
          <p className="text-white/60 mt-4 text-lg max-w-2xl">{episode.description}</p>
        </div>

        {!isUnlocked ? (
          <div className="w-full max-w-xl mx-auto mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 sm:p-12 text-center backdrop-blur-md shadow-2xl">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/20">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4 font-display uppercase tracking-wide">Locked Content</h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              This episode requires clearance code authorization. <br />
              Please enter your access key below.
            </p>

            <form onSubmit={handleUnlock} className="space-y-6">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ENTER CLEARANCE CODE"
                  className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-center tracking-[0.2em] text-lg font-mono uppercase"
                />
              </div>
              {verifyError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded text-sm">
                  {verifyError}
                </div>
              )}
              <button
                type="submit"
                disabled={verifying || !password}
                className="w-full bg-primary text-black font-bold py-4 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  "Unlock Episode"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full aspect-video bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl relative group mt-4 ring-1 ring-white/10">
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={episode.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/40 flex-col gap-4">
                <p>Video source unavailable</p>
                <p className="text-xs text-white/20">{episode.videoUrl}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
