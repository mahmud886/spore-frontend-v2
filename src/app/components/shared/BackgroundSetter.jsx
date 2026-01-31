"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function BackgroundSetter() {
  const pathname = usePathname();

  const getSrc = () => {
    if (pathname === "/result" || pathname.startsWith("/result")) {
      return "/assets/images/result-background.png";
    }
    if (pathname === "/about" || pathname.startsWith("/about")) {
      return "/assets/images/about-background.png";
    }
    return "/assets/images/background.png";
  };
  const src = getSrc();

  return (
    <div key={pathname} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Image
        key={src}
        src={src}
        alt="Background"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 100vw"
        quality={60}
        className="object-cover"
        priority={pathname === "/"}
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}
