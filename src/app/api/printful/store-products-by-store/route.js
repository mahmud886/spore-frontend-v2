import { getStoreProducts, getStores, getSyncProducts } from "@/lib/printful";
import { NextResponse } from "next/server";

/**
 * GET /api/printful/store-products-by-store
 * Get products for a specific store based on store type
 * Query params:
 *   - storeId: number (required) - ID of the store to fetch products from
 *   - limit: number (default: 20)
 *   - offset: number (default: 0)
 */
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get("storeId");
    const storeType = searchParams.get("type"); // Type of the store (squarespace, native, etc.)

    // Validate required storeId parameter
    if (!storeId) {
      return NextResponse.json({ error: "storeId parameter is required" }, { status: 400 });
    }

    const storeIdNum = parseInt(storeId, 10);
    if (isNaN(storeIdNum)) {
      return NextResponse.json({ error: "Invalid storeId parameter" }, { status: 400 });
    }

    // Get pagination parameters
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    console.log("Fetching products by store with params:", { storeId: storeIdNum, storeType, limit, offset });

    let products = [];
    let fetchMethodUsed = "";

    // Different store types may require different approaches to get their products
    if (storeType === "squarespace" || storeType === "shopify" || storeType === "woocommerce") {
      // For integrated stores, we typically use sync products
      try {
        console.log(`Attempting to fetch sync products for integrated store ${storeIdNum}...`);
        products = await getSyncProducts(storeIdNum, limit, offset);
        fetchMethodUsed = "sync_products";
        console.log(`Fetched ${products.length} sync products for integrated store`);
      } catch (syncError) {
        console.log(`Sync products failed for integrated store ${storeIdNum}, error:`, syncError.message);
        // Fall back to general store products if sync products don't work
        console.log("Falling back to catalog products...");
        products = await getStoreProducts(limit, offset);
        fetchMethodUsed = "catalog_products_fallback";
      }
    } else if (storeType === "native") {
      // For native stores, we might have different logic
      // Native stores in Printful typically use sync products as well
      try {
        console.log(`Attempting to fetch sync products for native store ${storeIdNum}...`);
        products = await getSyncProducts(storeIdNum, limit, offset);
        fetchMethodUsed = "sync_products";
        console.log(`Fetched ${products.length} sync products for native store`);

        // If no sync products found, try to see if we can get any store-related product information
        if (products.length === 0) {
          console.log(`No sync products found for native store ${storeIdNum}, attempting fallback...`);
          // Try getting all stores to see if there's store-specific product info
          const allStores = await getStores();
          console.log(`Found ${allStores.length} stores in account`);

          // Still fall back to general catalog if no sync products
          console.log("Falling back to catalog products for native store...");
          products = await getStoreProducts(limit, offset);
          fetchMethodUsed = "catalog_products_fallback_native";
        }
      } catch (syncError) {
        console.log(`Sync products failed for native store ${storeIdNum}, error:`, syncError.message);
        // Fall back to general store products if sync products don't work
        console.log("Falling back to catalog products for native store...");
        products = await getStoreProducts(limit, offset);
        fetchMethodUsed = "catalog_products_fallback_native";
      }
    } else {
      // For unknown store types, default to general store products
      console.log(`Unknown store type ${storeType}, using catalog products...`);
      products = await getStoreProducts(limit, offset);
      fetchMethodUsed = "catalog_products_unknown_type";
    }

    // Log the results
    console.log(`Final result for store ${storeIdNum}: ${products.length} products using method: ${fetchMethodUsed}`);

    return NextResponse.json({
      success: true,
      data: products,
      storeId: storeIdNum,
      storeType: storeType || "unknown",
      methodUsed: fetchMethodUsed,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching store products by store:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch store products by store",
        success: false,
      },
      { status: 500 },
    );
  }
}
