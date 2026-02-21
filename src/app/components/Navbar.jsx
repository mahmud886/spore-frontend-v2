"use client";

import { useCartStore } from "@/app/lib/store/useCartStore";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Wrapper } from "./shared/Wrapper";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const itemCount = useCartStore((state) => state.getItemCount());

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    if (!isClient) return;
    const updateHash = () => setCurrentHash(window.location.hash || "");
    updateHash();
    window.addEventListener("hashchange", updateHash);

    // Handle initial hash on mount or pathname change
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 500); // Slightly longer delay for home page dynamic content
    }

    return () => window.removeEventListener("hashchange", updateHash);
  }, [isClient, pathname]);

  // Helper function to get active class names
  const getActiveClass = (condition) => {
    return condition ? "text-primary" : "text-white/60 hover:text-primary";
  };

  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    // Close mobile menu when clicking a link
    setIsMobileMenuOpen(false);

    // Scroll to element on current page
    const scrollToElement = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Account for sticky navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

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
    <nav className="sticky top-0 z-50 bg-background-dark/20 backdrop-blur-md border-b border-black/5 px-6 py-4 ">
      <Wrapper>
        <div className="flex justify-between items-center">
          <Link href="/" className="font-display font-subheading font-bold text-xl tracking-widest">
            SPORE <span className="text-primary">FALL</span>
          </Link>
          <div className="flex items-center gap-6">
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
                className={`${getActiveClass(pathname === "/" && (currentHash === "" || currentHash === "#home"))} transition-colors`}
              >
                HOME
              </Link>
              <Link href="/vault-7" className={`${getActiveClass(pathname === "/vault-7")} transition-colors`}>
                VAULT 7
              </Link>
              <Link href="/shop" className={`${getActiveClass(pathname === "/shop")} transition-colors`}>
                SHOP
              </Link>
              <Link
                href="/partnerships"
                className={`${getActiveClass(pathname === "/partnerships")} transition-colors`}
              >
                PARTNERSHIPS
              </Link>
              <Link href="/support-us" className={`${getActiveClass(pathname === "/support-us")} transition-colors`}>
                SUPPORT US
              </Link>
            </div>

            {/* Cart Toggle Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-white/60 hover:text-primary transition-colors group"
              aria-label="Toggle Cart"
            >
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {isClient && itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(212,255,0,0.5)]"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

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
                  className={`${getActiveClass(pathname === "/" && (currentHash === "" || currentHash === "#home"))} transition-colors text-sm font-bold font-subheading tracking-widest uppercase py-2`}
                >
                  HOME
                </Link>
                <Link
                  href="/vault-7"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${getActiveClass(pathname === "/vault-7")} transition-colors text-sm font-bold font-subheading tracking-widest uppercase py-2`}
                >
                  VAULT 7
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${getActiveClass(pathname === "/shop")} transition-colors text-sm font-bold font-subheading tracking-widest uppercase py-2`}
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
