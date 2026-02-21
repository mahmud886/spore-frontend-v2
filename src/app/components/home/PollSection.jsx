import { getLatestLiveNotEndedPoll } from "../../lib/services/polls";
import HomePollContent from "./HomePollContent";

export default async function PollSection() {
  const p = await getLatestLiveNotEndedPoll();
  const pollData = p
    ? {
        ...p,
        episodeId: p.episodeId,
        title: p.title,
        question: p.question,
        description: p.description,
        status: p.status,
        options: p.options || [],
      }
    : null;

  if (!pollData) return null;

  // Helper to extract name safely
  const getName = (opt, fallback) => {
    if (!opt) return fallback;
    return (opt.text || opt.option_text || opt.name || opt.label || opt.title || fallback).toUpperCase();
  };

  // Helper to extract description safely
  const getDescription = (opt, defaultLabel) => {
    if (!opt) return defaultLabel;
    if (opt.description) return opt.description;
    // Fallback for Evolve/Resist themes only if description is missing
    const name = getName(opt, "").toUpperCase();
    if (name === "EVOLVE" || name === "EVOLUTION") return "TRANSCEND HUMANITY";
    if (name === "RESIST" || name === "RESISTANCE" || name === "CONTAIN") return "BURN THE OLD WORLD";
    return defaultLabel;
  };

  const option1 = pollData.options[0];
  const option2 = pollData.options[1] || { text: "OPTION 2", votes: 0 };

  const pollResultProps = option1
    ? {
        faction1: {
          name: getName(option1, "OPTION 1"),
          subLabel: getDescription(option1, ""),
          percentage:
            (option1.votes || option1.vote_count || 0) + (option2.votes || option2.vote_count || 0) > 0
              ? Math.round(
                  ((option1.votes || option1.vote_count || 0) /
                    ((option1.votes || option1.vote_count || 0) + (option2.votes || option2.vote_count || 0))) *
                    100,
                )
              : 50,
        },
        faction2: {
          name: getName(option2, "OPTION 2"),
          subLabel: getDescription(option2, ""),
          percentage:
            (option1.votes || option1.vote_count || 0) + (option2.votes || option2.vote_count || 0) > 0
              ? Math.round(
                  ((option2.votes || option2.vote_count || 0) /
                    ((option1.votes || option1.vote_count || 0) + (option2.votes || option2.vote_count || 0))) *
                    100,
                )
              : 50,
        },
        centerLabel: pollData.question || pollData.title || "THE CITY STANDS DIVIDED",
      }
    : null;

  const heroHeaderProps = {
    heading: "A NATION\nDIVIDED",
    status: `● STATUS: ACTIVE CONFLICT // THE STACKS IN SECTOR 7, ZONE 10`,
  };

  return <HomePollContent poll={pollData} pollResultProps={pollResultProps} heroHeaderProps={heroHeaderProps} />;
}
