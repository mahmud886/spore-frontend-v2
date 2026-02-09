import { createClient } from "@/app/lib/supabase-server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { type = "page_view", page_path, referrer, utm_source, utm_medium, utm_campaign, poll_id } = body;

    const userAgent = request.headers.get("user-agent");
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    // Try to get location from Vercel/Netlify headers or a free API
    let country = request.headers.get("x-vercel-ip-country") || "Unknown";
    let city = request.headers.get("x-vercel-ip-city") || "Unknown";

    // If headers aren't available (local dev), we could use an external API
    // but for performance in the main tracking route, we'll stick to headers or store IP for later processing

    // Track in social_media_clicks for now as a 'page_view' type
    // We'll use 'platform' as 'page_view' to distinguish
    
    let targetPollId = poll_id;
    
    // Fallback: if no poll_id is provided, try to find the first available poll
    // because the database has a NOT NULL constraint on poll_id
    if (!targetPollId) {
      const { data: firstPoll } = await supabase
        .from("polls")
        .select("id")
        .limit(1)
        .single();
      
      if (firstPoll) {
        targetPollId = firstPoll.id;
      }
    }

    const { error } = await supabase.from("social_media_clicks").insert({
      poll_id: targetPollId,
      platform: type === "page_view" ? "page_view" : body.platform,
      user_agent: userAgent,
      referrer: referrer || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_content: page_path || null,
      clicked_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error tracking:", error);
      // If it fails because of missing columns, we still want the request to succeed for the client
    }

    return NextResponse.json({ success: true, location: { country, city } });
  } catch (error) {
    console.error("Error in tracking route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
