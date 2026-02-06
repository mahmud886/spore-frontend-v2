"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wrapper } from "./shared/Wrapper";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSporeLogTooltipOpen, setIsSporeLogTooltipOpen] = useState(false);
  const tooltipTimeoutRef = useRef(null);
  const isClient = typeof window !== "undefined";
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    if (!isClient) return;
    const updateHash = () => setCurrentHash(window.location.hash || "");
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [isClient]);

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
            window.location.hash = "#shop";
            return true;
          }
          return false;
        };

        // Try to scroll immediately
        if (!scrollToElement()) {
          setTimeout(() => {
            const didScroll = scrollToElement();
            if (!didScroll) {
              window.location.hash = "#shop";
            }
          }, 100);
        }
      } else {
        // Navigate to result page with shop hash
        router.push("/result#shop");
        setCurrentHash("#shop");
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
        if (sectionId) {
          window.location.hash = `#${sectionId}`;
        }
        return true;
      }
      return false;
    };

    // Try to scroll immediately
    if (!scrollToElement()) {
      // If element not found, try after a short delay (for dynamic content)
      setTimeout(() => {
        const didScroll = scrollToElement();
        if (!didScroll && sectionId) {
          window.location.hash = `#${sectionId}`;
        }
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
              className={`${getActiveClass(pathname === "/")} transition-colors`}
            >
              HOME
            </Link>
            <div
              className="relative"
              onMouseEnter={() => {
                if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
                setIsSporeLogTooltipOpen(true);
              }}
              onMouseLeave={() => {
                tooltipTimeoutRef.current = setTimeout(() => {
                  setIsSporeLogTooltipOpen(false);
                }, 300);
              }}
            >
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
                className={`${getActiveClass(pathname === "/" && currentHash === "#spore-log")} transition-colors`}
              >
                VAULT 7
              </Link>
              {isSporeLogTooltipOpen && (
                <div className="absolute left-0 mt-2 w-max border border-white/10 rounded-lg bg-black/90 backdrop-blur-md shadow-2xl p-3 z-50">
                  <p className="text-[11px] text-primary break-all">
                    visit:{" "}
                    <a
                      href="https://edenstone.group/sporelog"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      https://edenstone.group/sporelog
                    </a>
                  </p>
                </div>
              )}
            </div>
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
              className={`${getActiveClass(pathname === "/result")} transition-colors`}
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
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden mt-4 pb-4 border-y border-primary pt-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    if (pathname === "/") {
                      handleScrollToSection(e, "home");
                    } else {
                      router.push("/");
                    }
                  }}
                  className={`${getActiveClass(pathname === "/")} transition-colors text-sm font-bold font-subheading tracking-widest uppercase py-2`}
                >
                  HOME
                </Link>
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    if (pathname === "/") {
                      handleScrollToSection(e, "spore-log");
                    } else {
                      router.push("/#spore-log");
                    }
                  }}
                  className={`${getActiveClass(pathname === "/" && currentHash === "#spore-log")} transition-colors text-sm font-bold font-subheading tracking-widest uppercase py-2`}
                >
                  VAULT 7
                </Link>
                <Link
                  href="/result"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    if (pathname === "/result") {
                      handleScrollToSection(e, "shop");
                    } else {
                      router.push("/result#shop");
                    }
                  }}
                  className={`${getActiveClass(pathname === "/result")} transition-colors text-sm font-bold font-subheading tracking-widest uppercase py-2`}
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
            </motion.div>
          )}
        </AnimatePresence>
      </Wrapper>
    </nav>
  );
}
