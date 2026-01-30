/**
 * Polls by Episode API Route
 * GET /api/polls/episode/[episodeId] - Get all polls for a specific episode with options
 */

import { createErrorResponse, createResponse } from "@/lib/db-helpers";
import { createClient } from "@/lib/supabase-server";

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { episodeId } = await params;

    if (!episodeId) {
      return createErrorResponse("Episode ID is required", 400);
    }

    console.log("Fetching polls for episode ID:", episodeId, "Type:", typeof episodeId);

    // Fetch polls for this episode (episode_id can be UUID string or number)
    const { data: polls, error: pollsError } = await supabase
      .from("polls")
      .select("*")
      .eq("episode_id", episodeId)
      .order("created_at", { ascending: false });

    if (pollsError) {
      return createErrorResponse(`Failed to fetch polls: ${pollsError.message}`, 500, pollsError.message);
    }

    if (!polls || polls.length === 0) {
      return createResponse({
        polls: [],
        total: 0,
      });
    }

    // Fetch options for each poll
    const pollsWithOptions = await Promise.all(
      polls.map(async (poll) => {
        const { data: options, error: optionsError } = await supabase
          .from("poll_options")
          .select("*")
          .eq("poll_id", poll.id)
          .order("id", { ascending: true });

        if (optionsError) {
          console.error(`Failed to fetch options for poll ${poll.id}:`, optionsError);
          // Return poll without options if fetch fails
          return {
            ...poll, // Spread all poll fields first
            id: poll.id,
            episodeId: poll.episode_id,
            question: poll.question || poll.title || poll.description,
            title: poll.title,
            createdAt: poll.created_at,
            status: poll.status || "LIVE",
            options: [],
          };
        }

        return {
          ...poll, // Spread all poll fields first
          id: poll.id,
          episodeId: poll.episode_id,
          question: poll.question || poll.title || poll.description,
          title: poll.title,
          createdAt: poll.created_at,
          status: poll.status || "LIVE",
          options:
            options?.map((opt) => ({
              id: opt.id,
              text: opt.text || opt.option_text,
              name: opt.name,
              description: opt.description || null,
              votes: opt.votes || opt.vote_count || 0,
              vote_count: opt.vote_count || 0,
            })) || [],
        };
      }),
    );

    return createResponse({
      polls: pollsWithOptions,
      total: pollsWithOptions.length,
    });
  } catch (error) {
    console.error("Error in getPollsByEpisode API route:", error);
    return createErrorResponse("Internal server error", 500, error.message);
  }
}
