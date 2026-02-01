import { createSyncProduct, getSyncProducts } from "@/app/lib/printful";
import { NextResponse } from "next/server";

/**
 * GET /api/printful/sync-products
 * Get sync products from Printful (for connected stores like Shopify, Squarespace, etc.)
 * Query params:
 *   - storeId: number (optional) - ID of the store to fetch products from (defaults to STORE_ID from env)
 *   - limit: number (default: 20)
 *   - offset: number (default: 0)
 */
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let storeId = searchParams.get("storeId");

    // If no storeId provided in query, try to get from environment
    if (!storeId) {
      storeId = process.env.PRINTFUL_STORE_ID;
      if (!storeId) {
        // Try to get the first available store from the stores API
        try {
          const storesResponse = await fetch(`${request.nextUrl.origin}/api/printful/stores`);
          if (storesResponse.ok) {
            const storesData = await storesResponse.json();
            if (storesData.data && storesData.data.length > 0) {
              storeId = storesData.data[0].id;
            }
          }
        } catch (storesError) {
          console.error("Error fetching stores to auto-select storeId:", storesError);
        }

        if (!storeId) {
          return NextResponse.json(
            {
              error: "storeId parameter is required",
              hint: "Either provide storeId as query parameter, set PRINTFUL_STORE_ID in environment variables, or ensure at least one store exists",
            },
            { status: 400 },
          );
        }
      }
    }

    const storeIdNum = parseInt(storeId, 10);
    if (isNaN(storeIdNum)) {
      return NextResponse.json({ error: "Invalid storeId parameter" }, { status: 400 });
    }

    // Get pagination parameters
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    console.log("Fetching sync products with params:", { storeId: storeIdNum, limit, offset });
    const products = await getSyncProducts(storeIdNum, limit, offset);
    console.log("Sync products returned:", products);
    console.log("Number of sync products:", products.length);

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching sync products:", error);

    // Handle case where sync products are not available for this store type
    if (error.message.includes("not available") || error.message.includes("Sync products endpoint not available")) {
      return NextResponse.json(
        {
          error: "Sync products not available for this store type",
          hint: "Your Printful account may be a Manual Order/API store which doesn't support sync products. Use store-products endpoint instead.",
          data: [],
        },
        { status: 200 }, // Return empty array instead of error
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch sync products",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/printful/sync-products
 * Create or update a sync product in Printful
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    if (!body.external_id) {
      return NextResponse.json({ error: "External ID is required" }, { status: 400 });
    }

    if (!Array.isArray(body.variants) || body.variants.length === 0) {
      return NextResponse.json({ error: "At least one variant is required" }, { status: 400 });
    }

    console.log("Creating sync product with data:", body);
    const result = await createSyncProduct(body);

    return NextResponse.json({
      success: true,
      message: "Sync product created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating sync product:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create sync product",
      },
      { status: 500 },
    );
  }
}
