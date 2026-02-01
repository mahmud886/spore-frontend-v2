import { getStoreProductDetail, getStoreProducts, getStoreProductsByExternalIds } from "@/app/lib/printful";
import { NextResponse } from "next/server";

/**
 * GET /api/printful/store-products
 * Get products from Printful store
 * Query params:
 *   - limit: number (default: 20)
 *   - offset: number (default: 0)
 *   - productId: number (optional) - if provided, returns single product with details
 *   - externalIds: string (optional) - comma-separated external IDs
 */
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const externalIds = searchParams.get("externalIds");

    // Get single product with details
    if (productId) {
      const id = parseInt(productId, 10);
      if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
      }

      console.log(`Fetching product detail for ID: ${id}`);
      const product = await getStoreProductDetail(id);

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: product });
    }

    // Get products by external IDs
    if (externalIds) {
      const ids = externalIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);
      if (ids.length === 0) {
        return NextResponse.json({ success: true, data: [] });
      }

      console.log(`Fetching products by external IDs:`, ids);
      const products = await getStoreProductsByExternalIds(ids);
      return NextResponse.json({ success: true, data: products });
    }

    // Get list of products
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Validate parameters
    if (isNaN(limit) || isNaN(offset) || limit <= 0 || limit > 100 || offset < 0) {
      return NextResponse.json(
        { error: "Invalid parameters: limit must be 1-100, offset must be >= 0" },
        { status: 400 },
      );
    }

    console.log("Fetching products with params:", { limit, offset });
    const products = await getStoreProducts(limit, offset);
    console.log("Products returned:", products.length);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        limit,
        offset,
        total: products.length, // Note: this is the count returned, not total available
      },
    });
  } catch (error) {
    console.error("Error in /api/printful/store-products:", error);

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

    // Check if it's a bad request error related to store type
    if (error.message.includes("Manual Order / API platform")) {
      return NextResponse.json(
        {
          error: "This API endpoint applies only to Printful stores based on the Manual Order / API platform.",
          details: error.message,
          hint: "Your store might be connected to a different platform (Shopify, WooCommerce, etc.)",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
