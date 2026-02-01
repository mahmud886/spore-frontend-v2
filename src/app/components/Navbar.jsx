"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Wrapper } from "./shared/Wrapper";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isClient = typeof window !== "undefined";
  const currentHash = isClient ? window.location.hash : "";

  // Helper function to get active class names
  const getActiveClass = (condition) => {
    return condition ? "text-primary" : "text-white/60 hover:text-primary";
  };

  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    // Close mobile menu when clicking a link
    setIsMobileMenuOpen(false);

    // Special handling for "shop" - always go to result page
    if (sectionId === "shop") {
      if (pathname === "/result") {
        // Already on result page, scroll to shop section
        const scrollToElement = () => {
          const element = document.getElementById("shop");
          if (element) {
            const offset = 80; // Account for sticky navbar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
            return true;
          }
          return false;
        };

        // Try to scroll immediately
        if (!scrollToElement()) {
          setTimeout(() => {
            scrollToElement();
          }, 100);
        }
      } else {
        // Navigate to result page with shop hash
        window.location.href = "/result#shop";
      }
      return;
    }

    // Scroll to element on current page
    const scrollToElement = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Account for sticky navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        return true;
      }
      return false;
    };

    // Try to scroll immediately
    if (!scrollToElement()) {
      // If element not found, try after a short delay (for dynamic content)
      setTimeout(() => {
        scrollToElement();
      }, 100);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 px-6 py-4 ">
      <Wrapper>
        <div className="flex justify-between items-center">
          <Link href="/" className="font-display font-subheading font-bold text-xl tracking-widest">
            SPORE <span className="text-primary">FALL</span>
          </Link>
          <div className="hidden md:flex space-x-8 text-xs font-bold font-subheading tracking-widest">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (pathname === "/") {
                  handleScrollToSection(e, "home");
                } else {
                  router.push("/");
                }
              }}
              className={`${getActiveClass(pathname === "/" && (!currentHash || currentHash === ""))} transition-colors`}
            >
              HOME
            </Link>
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (pathname === "/") {
                  handleScrollToSection(e, "spore-log");
                } else {
                  router.push("/#spore-log");
                }
              }}
              className={`${getActiveClass(pathname === "/" && isClient && window.location.hash === "#spore-log")} transition-colors`}
            >
              SPORE LOG
            </Link>
            <Link
              href="/result"
              onClick={(e) => {
                e.preventDefault();
                if (pathname === "/result") {
                  handleScrollToSection(e, "shop");
                } else {
                  router.push("/result#shop");
                }
              }}
              className={`${getActiveClass(pathname === "/result" && isClient && window.location.hash === "#shop")} transition-colors`}
            >
              SHOP
            </Link>
            <Link href="/partnerships" className={`${getActiveClass(pathname === "/partnerships")} transition-colors`}>
              PARTNERSHIPS
            </Link>
            <Link href="/support-us" className={`${getActiveClass(pathname === "/support-us")} transition-colors`}>
              SUPPORT US
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center text-primary hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  if (pathname === "/") {
                    handleScrollToSection(e, "home");
                  } else {
                    router.push("/");
                  }
                }}
                className={`${getActiveClass(pathname === "/" && (!isClient || window.location.hash === ""))} transition-colors text-sm font-bold font-subheading tracking-widest uppercase py-2`}
              >
                HOME
              </Link>
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  if (pathname === "/") {
                    handleScrollToSection(e, "spore-log");
                  } else {
                    router.push("/#spore-log");
                  }
                }}
                className={`${getActiveClass(pathname === "/" && isClient && window.location.hash === "#spore-log")} transition-colors text-sm font-bold font-subheading tracking-widest uppercase py-2`}
              >
                SPORE LOG
              </Link>
              <Link
                href="/result"
                onClick={(e) => {
                  e.preventDefault();
                  if (pathname === "/result") {
                    handleScrollToSection(e, "shop");
                  } else {
                    router.push("/result#shop");
                  }
                }}
                className={`${getActiveClass(pathname === "/result" && isClient && window.location.hash === "#shop")} transition-colors text-sm font-bold font-subheading tracking-widest uppercase py-2`}
              >
                SHOP
              </Link>
              <Link
                href="/partnerships"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${getActiveClass(pathname === "/partnerships")} transition-colors text-sm font-bold font-subheading tracking-widest uppercase py-2`}
              >
                PARTNERSHIPS
              </Link>
              <Link
                href="/support-us"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${getActiveClass(pathname === "/support-us")} transition-colors text-sm font-bold font-subheading tracking-widest uppercase py-2`}
              >
                SUPPORT US
              </Link>
            </div>
          </div>
        )}
      </Wrapper>
    </nav>
  );
}
