import HeroHeader from "../result/HeroHeader";
import PollResultSection from "../result/PollResultSection";
import { SectionTitle } from "../shared/SectionTitle";
import ClientPollSectionFullWidth from "./ClientPollSectionFullWidth";

export default function HomePollContent({ poll, pollResultProps, heroHeaderProps }) {
  if (!poll) return null;

  return (
    <section className="pb-16 px-0">
      <div id="home">
        <HeroHeader {...heroHeaderProps} />
      </div>

      <PollResultSection {...pollResultProps} />

      <div className="md:mt-24">
        <SectionTitle>Participate in the Poll</SectionTitle>
      </div>
      <div className="mt-8 flex items-center justify-center min-h-[420px]">
        <ClientPollSectionFullWidth poll={poll} />
      </div>
    </section>
  );
}
