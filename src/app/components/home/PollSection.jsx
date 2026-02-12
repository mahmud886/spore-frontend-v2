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

  // Calculate pollResultProps and heroHeaderProps
  const evolveOption = pollData.options?.find((opt) => {
    const name = (opt?.name || opt?.text || "").toUpperCase();
    return name === "EVOLVE" || name === "EVOLUTION";
  });
  const resistOption = pollData.options?.find((opt) => {
    const name = (opt?.name || opt?.text || "").toUpperCase();
    return name === "RESIST" || name === "RESISTANCE" || name === "CONTAIN";
  });

  const option1 = evolveOption || pollData.options[0];
  const option2 = resistOption || pollData.options[1] || pollData.options[0];

  const getSubLabel = (opt, defaultLabel) => {
    if (opt?.description) return opt.description;
    const name = (opt?.name || opt?.text || "").toUpperCase();
    if (name === "EVOLVE" || name === "EVOLUTION") return "TRANSCEND HUMANITY";
    if (name === "RESIST" || name === "RESISTANCE" || name === "CONTAIN") return "BURN THE OLD WORLD";
    return defaultLabel;
  };

  const pollResultProps =
    option1 && option2
      ? {
          faction1: {
            name: (option1.text || option1.option_text || "EVOLVE").toUpperCase(),
            subLabel: getSubLabel(option1, "TRANSCEND HUMANITY"),
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
            name: (option2.text || option2.option_text || "RESIST").toUpperCase(),
            subLabel: getSubLabel(option2, "BURN THE OLD WORLD"),
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
