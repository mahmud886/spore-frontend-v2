"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // If there's a hash in the URL, don't scroll to top
    // The browser/Next.js will handle scrolling to the hash element
    if (window.location.hash) return;

    // Scroll to top on route change with smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}
