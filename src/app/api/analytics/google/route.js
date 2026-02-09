import { NextResponse } from "next/server";

// Google Analytics Data API endpoint
export async function GET() {
  try {
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const GA_API_SECRET = process.env.GA_API_SECRET; // Server-side only

    if (!GA_MEASUREMENT_ID) {
      return NextResponse.json({
        error: "Google Analytics not configured",
        activeUsers: 0,
        sessions: 0,
        pageviews: 0,
        configured: false,
      });
    }

    // Return the configuration info and placeholders
    // Note: To get real-time active users, you need Google Analytics Data API
    return NextResponse.json({
      configured: true,
      measurementId: GA_MEASUREMENT_ID,
      activeUsers: "LIVE", // Indicator that tracking is active
      sessions: "TRACKING",
      pageviews: "ACTIVE",
      status: "Configured and tracking enabled",
      tracking: {
        ga4: !!GA_MEASUREMENT_ID,
        gtm: !!process.env.NEXT_PUBLIC_GTM_ID,
        facebook: !!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
        twitter: !!process.env.NEXT_PUBLIC_TWITTER_PIXEL_ID,
        linkedin: !!process.env.NEXT_PUBLIC_LINKEDIN_PIXEL_ID,
        tiktok: !!process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
        pinterest: !!process.env.NEXT_PUBLIC_PINTEREST_TAG_ID,
        microsoft: !!process.env.NEXT_PUBLIC_MICROSOFT_UET_ID,
      },
      note: "Data is being collected in your GA console. For in-app reporting, configure the Google Analytics Data API.",
    });
  } catch (error) {
    console.error("Error fetching GA data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        activeUsers: 0,
        configured: false,
      },
      { status: 500 },
    );
  }
}
