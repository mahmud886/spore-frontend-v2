/**
 * Printful API Library
 * Provides functions to interact with Printful API
 */

// Define Printful API constants
const PRINTFUL_API_URL = "https://api.printful.com";

/**
 * Get Printful API key from environment variables
 */
function getApiKey() {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) {
    throw new Error("PRINTFUL_API_KEY environment variable is not set");
  }
  return apiKey;
}

/**
 * Get store ID from environment variables (optional)
 */
function getStoreId() {
  return process.env.PRINTFUL_STORE_ID;
}

/**
 * Make authenticated request to Printful API
 */
async function printfulRequest(endpoint, options = {}) {
  const apiKey = getApiKey();
  const storeId = getStoreId();

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    // Include store ID in headers if available
    ...(storeId && { "X-PF-Store-Id": storeId }),
    ...options.headers,
  };

  const url = `${PRINTFUL_API_URL}${endpoint}`;
  console.log("Making Printful API request to:", url);
  console.log("Headers:", { ...headers, Authorization: "Bearer ***" }); // Don't log the actual key

  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log("Printful API Response Status:", response.status, response.statusText);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    console.error("Printful API Error Response:", JSON.stringify(errorData, null, 2));
    console.error("Response Status:", response.status, response.statusText);

    // Extract detailed error message
    let errorMessage = response.statusText;
    if (errorData) {
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.result && typeof errorData.result === "string") {
        errorMessage = errorData.result;
      } else if (typeof errorData === "string") {
        errorMessage = errorData;
      }
    }

    throw new Error(`Printful API error: ${errorMessage}`);
  }

  const jsonResponse = await response.json();
  console.log("Printful API Response Body:", JSON.stringify(jsonResponse, null, 2));
  return jsonResponse;
}

/**
 * Get products from Printful store
 * @param {number} limit - Number of products to return (default: 20, max: 100)
 * @param {number} offset - Offset for pagination (default: 0)
 */
async function getStoreProducts(limit = 20, offset = 0) {
  try {
    // First, check if we have stores
    console.log("Checking for available stores...");
    const stores = await getStores();

    if (stores.length === 0) {
      console.warn("No stores found. You need to create a Manual Order/API Store in Printful Dashboard.");
      console.warn("Go to: Printful Dashboard → Stores → Connect via API");
      return [];
    }

    console.log(
      `Found ${stores.length} store(s):`,
      stores.map((s) => ({ id: s.id, name: s.name, type: s.type })),
    );

    const storeId = getStoreId();
    let storeToUse;

    if (storeId) {
      // Use specified store ID
      storeToUse = stores.find((s) => s.id.toString() === storeId.toString());
    } else {
      // Prefer native/api/manual stores over connected stores (squarespace, shopify, etc.)
      storeToUse = stores.find((s) => s.type === "native" || s.type === "api" || s.type === "manual") || stores[0];
    }

    if (!storeToUse) {
      console.error(`Store ID ${storeId} not found in available stores`);
      console.error(
        "Available stores:",
        stores.map((s) => ({ id: s.id, name: s.name, type: s.type })),
      );
      return [];
    }

    console.log(`Using store: ${storeToUse.name} (ID: ${storeToUse.id}, Type: ${storeToUse.type})`);

    // Warn if using a connected store instead of native/api
    if (storeToUse.type !== "native" && storeToUse.type !== "api" && storeToUse.type !== "manual") {
      console.warn(
        `⚠️  Using ${storeToUse.type} connected store. For better API access, consider using a native/api store.`,
      );
      const nativeStore = stores.find((s) => s.type === "native" || s.type === "api" || s.type === "manual");
      if (nativeStore) {
        console.warn(
          `💡 Tip: You have a ${nativeStore.type} store "${nativeStore.name}" (ID: ${nativeStore.id}) which works better with the API.`,
        );
        console.warn(`   Set PRINTFUL_STORE_ID=${nativeStore.id} in .env.local to use it.`);
      }
    }

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    // Try with store ID in header
    const headers = {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      "X-PF-Store-Id": storeToUse.id.toString(),
    };

    const url = `${PRINTFUL_API_URL}/store/products?${params.toString()}`;
    console.log("Making request to:", url);
    console.log("With store ID header:", storeToUse.id);

    const response = await fetch(url, { headers });
    console.log("Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error("Printful API Error Response:", JSON.stringify(errorData, null, 2));

      if (response.status === 400) {
        const errorMsg = errorData.message || errorData.error?.message || "Invalid request";
        console.error("Bad Request Details:", {
          storeType: storeToUse.type,
          storeId: storeToUse.id,
          error: errorMsg,
          fullError: errorData,
        });

        // For connected stores (Squarespace, Shopify, etc.), products might need to be synced
        if (storeToUse.type !== "api" && storeToUse.type !== "manual") {
          console.warn(`⚠️  This is a ${storeToUse.type} connected store.`);
          console.warn("   Products in connected stores may need to be synced first.");
          console.warn("   Try: Printful Dashboard → Stores → Your Store → Sync Products");
        }

        throw new Error(
          `Bad Request: ${errorMsg}. Store type: ${storeToUse.type}. Make sure your token has Store/read and Products/read scopes.`,
        );
      }
      throw new Error(`Printful API error: ${errorData.message || errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    // console.log("Store products response:", data);

    if ("result" in data) {
      const products = Array.isArray(data.result) ? data.result : [];
      // console.log(`Successfully fetched ${products.length} store products`);

      // Don't filter out ignored products - show all products
      // User can un-ignore them in Printful Dashboard if needed
      // console.log(`Found ${products.length} total products (including ignored)`);

      return products;
    }

    console.warn("Unexpected response format:", data);

    // If store products failed and it's a connected store, try sync products
    if (storeToUse && storeToUse.type !== "native" && storeToUse.type !== "api" && storeToUse.type !== "manual") {
      console.log("Trying sync products endpoint for connected store...");
      const syncProducts = await getSyncProducts(storeToUse.id, limit, offset);
      if (syncProducts.length > 0) {
        console.log(`Found ${syncProducts.length} sync products`);
        // Transform sync products to match store product format
        return syncProducts.map((p) => ({
          id: p.id,
          name: p.name,
          thumbnail_url: p.thumbnail_url,
          variants: p.variants?.length || 0,
          synced: p.synced || 0,
          is_ignored: p.is_ignored || false,
        }));
      }
    }

    return [];
  } catch (error) {
    console.error("Error fetching store products:", error);

    // If error and it's a connected store, try sync products as fallback
    // Need to get storeToUse again since it might be out of scope
    try {
      const stores = await getStores();
      const storeId = getStoreId();
      const currentStore = storeId
        ? stores.find((s) => s.id.toString() === storeId.toString())
        : stores.find((s) => s.type === "native" || s.type === "api" || s.type === "manual") || stores[0];

      if (
        currentStore &&
        currentStore.type !== "native" &&
        currentStore.type !== "api" &&
        currentStore.type !== "manual"
      ) {
        console.log("Store products failed, trying sync products as fallback...");
        try {
          const syncProducts = await getSyncProducts(currentStore.id, limit, offset);
          if (syncProducts.length > 0) {
            console.log(`Found ${syncProducts.length} sync products via fallback`);
            return syncProducts.map((p) => ({
              id: p.id,
              name: p.name,
              thumbnail_url: p.thumbnail_url,
              variants: p.variants?.length || 0,
              synced: p.synced || 0,
              is_ignored: p.is_ignored || false,
            }));
          }
        } catch (syncError) {
          console.error("Sync products also failed:", syncError);
        }
      }
    } catch (fallbackError) {
      console.error("Error in fallback logic:", fallbackError);
    }

    throw error;
  }
}

/**
 * Get product detail
 * @param {number} productId - ID of the product to retrieve
 */
async function getStoreProductDetail(productId) {
  try {
    // Try the working products endpoint
    const response = await printfulRequest(`/products/${productId}`);

    console.log("Product detail response:", response);

    if ("result" in response) {
      return response.result;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product detail:", error);
    throw error;
  }
}

/**
 * Get products by external IDs
 * @param {string[]} externalIds - Array of external IDs to search for
 */
async function getStoreProductsByExternalIds(externalIds) {
  try {
    if (!Array.isArray(externalIds) || externalIds.length === 0) {
      return [];
    }

    // Join external IDs with commas for the query parameter
    const externalIdsParam = externalIds.join(",");
    // Since /products endpoint works, use it with external_ids parameter
    const response = await printfulRequest(`/products?external_ids=${externalIdsParam}`);

    console.log("Products by external IDs response:", response);

    if ("result" in response) {
      const products = Array.isArray(response.result) ? response.result : [];
      console.log(`Found ${products.length} products by external IDs`);
      return products;
    }
    return [];
  } catch (error) {
    console.error("Error fetching products by external IDs:", error);
    throw error;
  }
}

/**
 * Get list of stores
 */
/**
 * Get list of stores
 */
async function getStores() {
  try {
    const response = await printfulRequest("/stores");

    console.log("Stores response:", response);

    if ("result" in response) {
      return Array.isArray(response.result) ? response.result : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
}

/**
 * Get sync products (for connected stores like Squarespace, Shopify)
 * @param {number} storeId - ID of the store to fetch products from
 * @param {number} limit - Number of products to return (default: 20, max: 100)
 * @param {number} offset - Offset for pagination (default: 0)
 */
async function getSyncProducts(storeId, limit = 20, offset = 0) {
  try {
    // First, get store information to check if it supports sync products
    const storeInfo = await getStores();
    const store = storeInfo.find((s) => s.id === storeId);

    if (!store) {
      throw new Error(`Store with ID ${storeId} not found`);
    }

    // Check if store type supports sync products
    const syncSupportedTypes = ["squarespace", "shopify", "woocommerce", "bigcommerce", "wix"];
    if (!syncSupportedTypes.includes(store.type)) {
      console.log(`Store type '${store.type}' does not support sync products`);
      return [];
    }

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    // Try the correct endpoint for getting sync products for a specific store
    // According to Printful API docs, this should be /stores/{storeId}/sync-products
    const response = await printfulRequest(`/stores/${storeId}/sync-products?${params.toString()}`);

    console.log("Sync products response for store", storeId, ":", response);

    if ("result" in response) {
      const products = Array.isArray(response.result) ? response.result : [];
      console.log(`Found ${products.length} sync products for store ${storeId}`);
      return products;
    }
    return [];
  } catch (error) {
    console.error("Error fetching sync products for store", storeId, ":", error);

    // If the store-specific endpoint doesn't work, try the general sync-products endpoint
    try {
      console.log("Trying general sync-products endpoint...");
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const headers = {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
        "X-PF-Store-Id": storeId.toString(),
      };

      const url = `${PRINTFUL_API_URL}/sync-products?${params.toString()}`;
      console.log("Fetching sync products from general endpoint:", url);

      const response = await fetch(url, { headers });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error("General sync products error:", errorData);
        throw new Error(`Sync products API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log("General sync products response:", data);

      if ("result" in data) {
        const products = Array.isArray(data.result) ? data.result : [];
        console.log(`Found ${products.length} sync products via general endpoint for store ${storeId}`);
        return products;
      }
    } catch (secondError) {
      console.error("Both sync product endpoints failed:", secondError);
      // Return empty array if neither endpoint works
      return [];
    }

    return [];
  }
}

/**
 * Create a sync product in Printful
 * @param {Object} productData - Product data to sync
 */
async function createSyncProduct(productData) {
  try {
    const storeId = getStoreId();
    if (!storeId) {
      throw new Error("PRINTFUL_STORE_ID environment variable is required for creating sync products");
    }

    // Try the correct endpoint for creating sync products
    // According to Printful API docs, this should be /stores/{storeId}/sync-products
    const response = await printfulRequest(`/stores/${storeId}/sync-products`, {
      method: "POST",
      body: JSON.stringify(productData),
    });

    console.log("Create sync product response:", response);

    if ("result" in response) {
      console.log("Sync product created successfully");
      return response.result;
    }

    throw new Error("Invalid response format when creating sync product");
  } catch (error) {
    console.error("Error creating sync product:", error);

    // If the store-specific endpoint doesn't work, try the general sync-products endpoint
    try {
      console.log("Trying general sync-products endpoint for creation...");
      const headers = {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
        "X-PF-Store-Id": storeId,
      };

      const url = `${PRINTFUL_API_URL}/sync-products`;
      console.log("Creating sync product at general endpoint:", url);

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(productData),
      });

      console.log("General create sync product response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error("General create sync product error:", errorData);
        throw new Error(`Failed to create sync product: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log("General create sync product response:", data);

      if ("result" in data) {
        console.log("Sync product created successfully via general endpoint");
        return data.result;
      }

      throw new Error("Invalid response format when creating sync product via general endpoint");
    } catch (secondError) {
      console.error("Both sync product creation endpoints failed:", secondError);
      throw secondError;
    }
  }
}

// Export all functions
export {
  createSyncProduct,
  getStoreProductDetail,
  getStoreProducts,
  getStoreProductsByExternalIds,
  getStores,
  getSyncProducts,
  printfulRequest,
};
