"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import resultBg from "../../../../public/assets/images/result-background.webp";

export default function BackgroundSetter() {
  const pathname = usePathname();

  const image = resultBg;
  const isHomepage = pathname === "/";

  return (
    <div key={pathname} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Image
        key={image.src || pathname}
        src={image}
        alt="Background"
        fill
        sizes="100vw"
        quality={55}
        placeholder="blur"
        className="object-cover"
        priority={isHomepage}
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}
