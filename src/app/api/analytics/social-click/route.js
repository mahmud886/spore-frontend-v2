import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { poll_id, platform, user_agent, referrer, utm_source, utm_medium, utm_campaign, utm_content } = body;

    if (!poll_id || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert click tracking data
    const { error } = await supabase.from("social_media_clicks").insert({
      poll_id: poll_id, // UUID, no need to parse
      platform,
      user_agent: user_agent || null,
      referrer: referrer || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_content: utm_content || null,
      clicked_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error tracking click:", error);
      return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Click tracked successfully" });
  } catch (error) {
    console.error("Error in social click tracking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get("poll_id");

    if (!pollId) {
      return NextResponse.json({ error: "Missing poll_id" }, { status: 400 });
    }

    // Get click statistics for this poll
    const { data: clicks, error } = await supabase
      .from("social_media_clicks")
      .select("platform, clicked_at")
      .eq("poll_id", pollId); // UUID, no need to parse

    if (error) {
      console.error("Error fetching clicks:", error);
      return NextResponse.json({ error: "Failed to fetch clicks" }, { status: 500 });
    }

    // Group by platform
    const stats = (clicks || []).reduce((acc, click) => {
      const platform = click.platform;
      if (!acc[platform]) {
        acc[platform] = { count: 0, platform };
      }
      acc[platform].count++;
      return acc;
    }, {});

    return NextResponse.json({
      total: clicks?.length || 0,
      platforms: Object.values(stats),
    });
  } catch (error) {
    console.error("Error in social click stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
