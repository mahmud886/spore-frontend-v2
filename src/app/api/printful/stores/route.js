import { getStores } from "@/app/lib/printful";
import { NextResponse } from "next/server";

/**
 * GET /api/printful/stores
 * Get all stores from Printful
 */
export async function GET(request) {
  try {
    console.log("Fetching all stores from Printful");
    const stores = await getStores();

    console.log("Stores returned:", stores.length);

    return NextResponse.json({
      success: true,
      data: stores,
      count: stores.length,
    });
  } catch (error) {
    console.error("Error in /api/printful/stores:", error);

    // Check if it's an authentication error
    if (error.message.includes("403") || error.message.includes("authorization")) {
      return NextResponse.json(
        {
          error: "Authentication failed. Please check your PRINTFUL_API_KEY.",
          details: error.message,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch stores",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
