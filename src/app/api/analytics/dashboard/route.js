import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "7"; // days

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeframe));

    // Get total polls count
    const { count: totalPolls, error: pollsError } = await supabase
      .from("polls")
      .select("*", { count: "exact", head: true });

    if (pollsError) throw pollsError;

    // Get total votes count from poll_options
    const { data: allOptions, error: optionsError } = await supabase.from("poll_options").select("vote_count");

    if (optionsError) throw optionsError;

    const totalVotes = (allOptions || []).reduce((sum, option) => sum + (option.vote_count || 0), 0) || 0;

    // Get total social shares (clicks) - handle case where table doesn't exist yet
    let allShares = [];
    let recentShares = [];
    try {
      const { data: sharesData, error: sharesError } = await supabase.from("social_media_clicks").select("*");
      if (sharesError && sharesError.code !== "42P01") {
        // 42P01 is "relation does not exist" - ignore if table doesn't exist yet
        throw sharesError;
      }
      allShares = sharesData || [];

      // Get recent social shares
      const { data: recentSharesData, error: recentSharesError } = await supabase
        .from("social_media_clicks")
        .select("*")
        .gte("clicked_at", daysAgo.toISOString());

      if (recentSharesError && recentSharesError.code !== "42P01") {
        throw recentSharesError;
      }
      recentShares = recentSharesData || [];
    } catch (tableError) {
      // Table doesn't exist yet - use empty arrays
      if (tableError.code !== "42P01") {
        console.warn("Social media clicks table not found, using empty data:", tableError.message);
      }
    }

    // Get top polls by votes
    const { data: topPollsByVotes, error: topPollsError } = await supabase
      .from("polls")
      .select(
        `
        id,
        title,
        created_at,
        poll_options (
          vote_count
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(10);

    if (topPollsError) throw topPollsError;

    // Calculate votes per poll
    const pollsWithVotes = (topPollsByVotes || []).map((poll) => {
      const totalVotes = poll.poll_options?.reduce((sum, option) => sum + (option.vote_count || 0), 0) || 0;
      return {
        id: poll.id,
        question: poll.title || "Untitled Poll",
        created_at: poll.created_at,
        total_votes: totalVotes,
      };
    });

    // Sort by votes
    const sortedPolls = pollsWithVotes.sort((a, b) => b.total_votes - a.total_votes).slice(0, 5);

    // Get platform statistics from all shares
    const platformStats = (allShares || []).reduce((acc, share) => {
      const platform = share.platform;
      if (!acc[platform]) {
        acc[platform] = { platform, count: 0 };
      }
      acc[platform].count++;
      return acc;
    }, {});

    // Get UTM source statistics
    const utmStats = (recentShares || []).reduce((acc, share) => {
      const source = share.utm_source || "direct";
      if (!acc[source]) {
        acc[source] = { source, clicks: 0, campaigns: new Set() };
      }
      acc[source].clicks++;
      if (share.utm_campaign) {
        acc[source].campaigns.add(share.utm_campaign);
      }
      return acc;
    }, {});

    const utmSourcesArray = Object.values(utmStats)
      .map((stat) => ({
        source: stat.source,
        clicks: stat.clicks,
        campaigns: stat.campaigns.size,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    // Get referrer statistics
    const referrerStats = (recentShares || []).reduce((acc, share) => {
      const referrer = share.referrer || "direct";
      let domain = "direct";
      try {
        if (referrer !== "direct" && referrer) {
          domain = new URL(referrer).hostname.replace("www.", "");
        }
      } catch (e) {
        domain = "direct";
      }
      if (!acc[domain]) {
        acc[domain] = { referrer: domain, count: 0 };
      }
      acc[domain].count++;
      return acc;
    }, {});

    const referrerArray = Object.values(referrerStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get daily shares for the timeframe
    const dailyShares = {};
    (recentShares || []).forEach((share) => {
      const date = new Date(share.clicked_at).toISOString().split("T")[0];
      dailyShares[date] = (dailyShares[date] || 0) + 1;
    });

    // Fill missing dates with 0
    const dailySharesArray = [];
    for (let i = parseInt(timeframe) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dailySharesArray.push({
        date: dateStr,
        count: dailyShares[dateStr] || 0,
      });
    }

    return NextResponse.json({
      overview: {
        totalPolls: totalPolls || 0,
        totalVotes: totalVotes || 0,
        totalShares: allShares?.length || 0,
        recentShares: recentShares?.length || 0,
      },
      topPolls: sortedPolls,
      platformStats: Object.values(platformStats).sort((a, b) => b.count - a.count),
      utmSources: utmSourcesArray,
      referrers: referrerArray,
      dailyShares: dailySharesArray,
      timeframe: parseInt(timeframe),
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
