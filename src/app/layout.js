import localFont from "next/font/local";
import { Suspense } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/popups/CartDrawer";
import { Analytics } from "./components/shared/Analytics";
import BackgroundSetter from "./components/shared/BackgroundSetter";
import ScrollToTop from "./components/shared/ScrollToTop";
import VerticalLines from "./components/shared/VerticalLines";
import { Wrapper } from "./components/shared/Wrapper";
import "./globals.css";

const gotham = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    { path: "../../public/assets/fonts/gotham/Gotham-Book.otf", weight: "400", style: "normal" },
    { path: "../../public/assets/fonts/gotham/Gotham-BookItalic.otf", weight: "400", style: "italic" },
    { path: "../../public/assets/fonts/gotham/Gotham-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/assets/fonts/gotham/Gotham-MediumItalic.otf", weight: "500", style: "italic" },
  ],
});

const astro = localFont({
  variable: "--font-heading",
  display: "swap",
  src: [{ path: "../../public/assets/fonts/astro/astro.ttf", weight: "400", style: "normal" }],
});

const mokoto = localFont({
  variable: "--font-subheading",
  display: "swap",
  src: [{ path: "../../public/assets/fonts/mokoto/mokoto.ttf", weight: "400", style: "normal" }],
});

export const metadata = {
  metadataBase: new URL("https://sporefall.com"),
  title: "SPORE FALL | a Sci-Fi Saga",
  description:
    "A deadly pathogen threatens to overrun the nation city of Lionara. Join the resistance or embrace the evolution.",
  openGraph: {
    title: "SPORE FALL | a Sci-Fi Saga",
    description:
      "A deadly pathogen threatens to overrun the nation city of Lionara. Join the resistance or embrace the evolution.",
    url: "/",
    siteName: "SPORE FALL",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "SPORE FALL - a Sci-Fi Saga",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPORE FALL | a Sci-Fi Saga",
    description:
      "A deadly pathogen threatens to overrun the nation city of Lionara. Join the resistance or embrace the evolution.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${gotham.variable} ${astro.variable} ${mokoto.variable}`}>
      <head>
        <link rel="preconnect" href="https://lh3.googleusercontent.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.squarespace-cdn.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.squarespace-cdn.com" />
      </head>
      <body className="antialiased text-white selection:bg-primary selection:text-black overflow-x-hidden ">
        <ScrollToTop />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <BackgroundSetter />
        <VerticalLines />
        <div className="text-white selection:bg-primary selection:text-black cyber-hex-grid">
          <div className="cyber-screen-flicker">
            {/* max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 */}
            <Navbar />
            <CartDrawer />
            {children}
            <Wrapper>
              <Footer />
            </Wrapper>
          </div>
        </div>
      </body>
    </html>
  );
}
