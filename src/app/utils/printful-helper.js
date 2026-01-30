/**
 * Printful API Helper Functions
 * This utility file contains helper functions to interact with the Printful API
 */

// Function to get store products from our API route
export async function getStoreProducts() {
  try {
    console.log("Fetching store products from Printful...");

    const response = await fetch("/api/printful/products");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch products: ${errorData.error || "Unknown error"}`);
    }

    const data = await response.json();
    console.log("Received products from Printful:", data);

    return data;
  } catch (error) {
    console.error("Error in getStoreProducts:", error);
    throw error;
  }
}

// Function to sync a product to Printful via our API route
export async function syncProduct(productData) {
  try {
    console.log("Syncing product to Printful:", productData);

    const response = await fetch("/api/printful/sync-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to sync product: ${errorData.error || "Unknown error"}`);
    }

    const data = await response.json();
    console.log("Successfully synced product:", data);

    return data;
  } catch (error) {
    console.error("Error in syncProduct:", error);
    throw error;
  }
}

// Test function to verify the Printful API integration
export async function testPrintfulIntegration() {
  console.log("Testing Printful API integration...");

  try {
    // First, try to get store products
    console.log("1. Testing getStoreProducts...");
    const products = await getStoreProducts();
    console.log("Successfully fetched products:", products.count, "products found");

    // Example of how to sync a product (this would be used with actual product data)
    console.log("\n2. Example syncProduct usage (not executed to avoid creating test products):");
    console.log(`
      To sync a product, call syncProduct with data like:
      syncProduct({
        externalProductId: 'unique-product-id',
        productName: 'Test Product Name',
        description: 'Product description',
        variants: [
          {
            external_id: 'variant-1',
            name: 'Black T-Shirt',
            sku: 'TS-BLK-SM',
            retail_price: '25.00',
            image_urls: ['https://example.com/image.jpg']
          }
        ]
      })
    `);

    console.log("\nPrintful API integration test completed successfully!");
    return { success: true, productsCount: products.count };
  } catch (error) {
    console.error("Printful API integration test failed:", error);
    return { success: false, error: error.message };
  }
}
