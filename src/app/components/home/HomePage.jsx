"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Wrapper } from "../shared/Wrapper";
import HeroSection from "./HeroSection";
import { PrologueSection } from "./PrologueSection";
import { Synopsis } from "./Synopsis";
const SporeBlogSection = dynamic(() => import("../shared/SporeBlogSection"));
const CharacterLogsSection = dynamic(() => import("./CharacterLogsSection"));
const EpisodesSection = dynamic(() => import("./EpisodesSection"));
const NewsletterSection = dynamic(() => import("./NewsletterSection"));

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
      </Wrapper>
    </>
  );
}
