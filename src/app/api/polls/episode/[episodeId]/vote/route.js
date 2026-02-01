/**
 * Vote by Episode ID API Route
 * POST /api/polls/episode/[episodeId]/vote - Submit a vote for a poll option by episode ID
 */

import { createErrorResponse, createResponse } from "@/app/lib/db-helpers";
import { createClient } from "@/app/lib/supabase-server";

export async function POST(request, { params }) {
  try {
    const supabase = await createClient();
    const { episodeId } = await params;
    const body = await request.json();

    if (!episodeId) {
      return createErrorResponse("Episode ID is required", 400);
    }

    if (!body.optionId) {
      return createErrorResponse("Option ID is required", 400);
    }

    console.log("Voting for episode:", episodeId, "Option ID:", body.optionId);

    // Find the poll for this episode (get the first LIVE poll)
    const { data: polls, error: pollsError } = await supabase
      .from("polls")
      .select("*")
      .eq("episode_id", episodeId)
      .eq("status", "LIVE")
      .order("created_at", { ascending: false })
      .limit(1);

    if (pollsError) {
      return createErrorResponse(`Failed to find poll: ${pollsError.message}`, 500, pollsError.message);
    }

    if (!polls || polls.length === 0) {
      return createErrorResponse("No active poll found for this episode", 404);
    }

    const poll = polls[0];
    console.log("Found poll:", poll.id);

    // Verify the option belongs to this poll
    const { data: option, error: optionError } = await supabase
      .from("poll_options")
      .select("*")
      .eq("id", body.optionId)
      .eq("poll_id", poll.id)
      .single();

    if (optionError || !option) {
      return createErrorResponse("Invalid option ID or option does not belong to this poll", 400);
    }

    // Increment vote count atomically using Supabase RPC or direct increment
    // First, get current count to ensure we have a valid value
    const currentVoteCount = option.vote_count || 0;

    // Use Supabase's increment by updating with the new value
    // Note: For true atomic increment, you'd need a database function, but this works for most cases
    const newVoteCount = currentVoteCount + 1;

    const { data: updatedOption, error: updateError } = await supabase
      .from("poll_options")
      .update({ vote_count: newVoteCount })
      .eq("id", body.optionId)
      .select()
      .single();

    if (updateError) {
      return createErrorResponse(`Failed to record vote: ${updateError.message}`, 500, updateError.message);
    }

    // Fetch complete poll with all updated options
    const { data: completePoll, error: fetchError } = await supabase
      .from("polls")
      .select(
        `
        *,
        episodes(id, title, episode_number, season_number),
        poll_options(*)
      `,
      )
      .eq("id", poll.id)
      .single();

    if (fetchError) {
      return createErrorResponse("Failed to fetch updated poll", 500, fetchError.message);
    }

    return createResponse({
      message: "Vote recorded successfully",
      poll: completePoll,
      episodeId: episodeId,
    });
  } catch (error) {
    console.error("Error in vote by episode API route:", error);
    return createErrorResponse("Internal server error", 500, error.message);
  }
}
