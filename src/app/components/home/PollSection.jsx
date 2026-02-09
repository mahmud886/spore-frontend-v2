import { getLatestLiveNotEndedPoll } from "../../lib/services/polls";
import { SectionTitle } from "../shared/SectionTitle";
import ClientPollSectionFullWidth from "./ClientPollSectionFullWidth";

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
  return (
    <section className="pb-16 px-0">
      <SectionTitle>Participate in the Poll</SectionTitle>
      <div className="mt-8 flex items-center justify-center min-h-[420px]">
        <ClientPollSectionFullWidth poll={pollData} />
      </div>
    </section>
  );
}
