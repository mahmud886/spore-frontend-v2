"use client";

import { useEffect, useRef, useState } from "react";

export default function LazyBackgroundVideo({
  sources = [{ src: "/assets/videos/infection_WIDE_2.mp4", type: "video/mp4" }],
  poster = "/assets/images/background.png",
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = "none",
}) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loaded) {
          setLoaded(true);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loaded]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (loaded && autoPlay) {
      el.play().catch(() => {});
    }
    return () => {
      try {
        el.pause();
      } catch {}
    };
  }, [loaded, autoPlay]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
      poster={poster}
    >
      {loaded && sources.map((s) => <source key={`${s.src}-${s.type}`} src={s.src} type={s.type} />)}
    </video>
  );
}
