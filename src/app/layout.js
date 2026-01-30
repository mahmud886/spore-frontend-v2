import ExternalStyles from "./ExternalStyles";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import BackgroundSetter from "./components/shared/BackgroundSetter";
import VerticalLines from "./components/shared/VerticalLines";
import { Wrapper } from "./components/shared/Wrapper";
import { Analytics } from "./components/shared/Analytics";
import "./globals.css";

export const metadata = {
  title: "SPORE FALL | Sci-Fi Narrative Series",
  description: "The city of Lionara is quarantined. A spore is rewriting human fate.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased text-white selection:bg-primary selection:text-black overflow-x-hidden ">
        <Analytics />
        <ExternalStyles />
        <BackgroundSetter />
        <VerticalLines />
        <div className="text-white selection:bg-primary selection:text-black cyber-hex-grid">
          <div className="cyber-screen-flicker">
            {/* max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 */}
            <Navbar />
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
