"use client";

import { useEffect, useState } from "react";
import PollStepModal from "../popups/PollStepModal";
import SporeBlogSection from "../shared/SporeBlogSection";
import { Wrapper } from "../shared/Wrapper";
import CharacterLogsSection from "./CharacterLogsSection";
import EpisodesSection from "./EpisodesSection";
import HeroSection from "./HeroSection";
import NewsletterSection from "./NewsletterSection";
import { PrologueSection } from "./PrologueSection";
import { Synopsis } from "./Synopsis";

const homePageLogs = [
  {
    id: "XYZ_#325SAD",
    timestamp: "2 hour ago",
    title: "Patient Zero Identified",
    description:
      "Surveillance drones have captured footage of the initial contagion site. Containment protocols were... delayed.",
    image: "/assets/images/blogs/blog-1.png",
    imageAlt: "Patient Zero Identified",
    link: "#",
  },
  {
    id: "XYZ_#822SAD",
    timestamp: "2 hour ago",
    title: "Wall Construction",
    description:
      "Surveillance drones have captured footage of the initial contagion site. Containment protocols were... delayed.",
    image: "/assets/images/blogs/blog-2.png",
    imageAlt: "Wall Construction",
    link: "#",
  },
  {
    id: "CONTAINMENT",
    timestamp: "2 hour ago",
    title: "Mutation Rate",
    description:
      "Surveillance drones have captured footage of the initial contagion site. Containment protocols were... delayed.",
    image: "/assets/images/blogs/blog-3.png",
    imageAlt: "Mutation Rate",
    link: "#",
  },
  {
    id: "QUARANTINE_001",
    timestamp: "4 min ago",
    title: "Quarantine Protocol",
    description:
      "Surveillance drones have captured footage of the initial contagion site. Containment protocols were... delayed.",
    image: "/assets/images/blogs/blog-1.png",
    imageAlt: "Quarantine Protocol",
    link: "#",
  },
];

export default function HomePage({ episodes = [], blogPosts = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasModalBeenShown, setHasModalBeenShown] = useState(false);

  // Check if user has voted - used to prevent modal from opening
  const checkIfUserVoted = () => {
    try {
      const storedVoted = localStorage.getItem("sporefall_voted_episodes");
      if (storedVoted) {
        const parsedVoted = JSON.parse(storedVoted);
        if (Array.isArray(parsedVoted) && parsedVoted.length > 0) {
          return true; // User has voted
        }
      }
    } catch (err) {
      // If parse fails, assume user hasn't voted (first visit)
    }
    return false; // User hasn't voted
  };

  // Handle scroll detection for EpisodesSection
  useEffect(() => {
    // Only set up observer if modal hasn't been shown yet
    if (hasModalBeenShown) return;

    // Check localStorage FIRST - if user has voted, don't open modal
    if (checkIfUserVoted()) {
      setHasModalBeenShown(true); // Mark as shown to prevent further checks
      return; // Don't set up observer if user has voted
    }

    // Check if modal was closed
    const modalClosed = localStorage.getItem("sporefall_modal_closed");
    if (modalClosed === "true") {
      setHasModalBeenShown(true);
      return; // Don't set up observer if modal was closed
    }

    const episodesSection = document.getElementById("shop");
    if (!episodesSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When the section is visible in the viewport
          if (entry.isIntersecting && !hasModalBeenShown) {
            // Check localStorage again before opening (double safety check)
            if (checkIfUserVoted()) {
              setHasModalBeenShown(true);
              observer.disconnect();
              return; // User has voted, don't open modal
            }

            // Check if modal was closed
            const modalClosedCheck = localStorage.getItem("sporefall_modal_closed");
            if (modalClosedCheck === "true") {
              setHasModalBeenShown(true);
              observer.disconnect();
              return; // Modal was closed, don't open
            }

            // All checks passed - safe to open modal
            setIsModalOpen(true);
            setHasModalBeenShown(true);
            // Disconnect observer after showing modal once
            observer.disconnect();
          }
        });
      },
      {
        // Trigger when at least 30% of the section is visible
        threshold: 0.3,
        // Add some margin from the top
        rootMargin: "-80px 0px 0px 0px", // Account for navbar height
      },
    );

    observer.observe(episodesSection);

    return () => {
      observer.disconnect();
    };
  }, [hasModalBeenShown]);

  // Handle hash navigation on page load
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, []);

  return (
    <>
      <div id="home">
        <HeroSection />
      </div>
      <Synopsis />
      <PrologueSection />
      <Wrapper>
        <div className="relative z-10 -mx-4 sm:-mx-6 lg:-mx-8">
          {/* <AboutSection /> */}

          <div id="shop">
            <EpisodesSection episodes={episodes} />
          </div>
          <div className="px-10 ">
            <NewsletterSection />
          </div>
          <CharacterLogsSection />
          <div id="spore-log" className="pb-4 px-8 ">
            <SporeBlogSection
              title="Spore Logs"
              className=""
              sectionClassName=""
              fetchFromAPI={false}
              posts={blogPosts}
            />
          </div>
        </div>
        <PollStepModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setHasModalBeenShown(true); // Mark as shown even if closed manually
          }}
          autoOpenDelay={0}
        />
      </Wrapper>
    </>
  );
}
