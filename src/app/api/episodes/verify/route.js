import { createErrorResponse, createResponse } from "@/app/lib/db-helpers";
import { createClient } from "@/app/lib/supabase-server";

export async function POST(request) {
  try {
    const { id, password } = await request.json();

    if (!id || !password) {
      return createErrorResponse("Episode ID and password are required", 400);
    }

    const supabase = await createClient();

    // Fetch the episode password
    const { data: episode, error } = await supabase.from("episodes").select("password").eq("id", id).single();

    if (error || !episode) {
      return createErrorResponse("Episode not found", 404);
    }

    // Check if password matches
    // Note: Assuming plain text password for now as per migration
    if (episode.password === password) {
      return createResponse({ success: true });
    } else {
      return createErrorResponse("Incorrect password", 401);
    }
  } catch (error) {
    return createErrorResponse("Internal server error", 500, error.message);
  }
}
