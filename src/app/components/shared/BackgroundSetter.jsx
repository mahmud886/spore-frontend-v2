"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function BackgroundSetter() {
  const pathname = usePathname();

  useEffect(() => {
    // Remove all background classes
    document.documentElement.classList.remove("bg-home", "bg-result", "bg-about");

    // Add appropriate background class based on route
    if (pathname === "/result" || pathname.startsWith("/result")) {
      document.documentElement.classList.add("bg-result");
    } else if (pathname === "/about" || pathname.startsWith("/about")) {
      document.documentElement.classList.add("bg-about");
    } else {
      document.documentElement.classList.add("bg-home");
    }
  }, [pathname]);

  return null;
}
