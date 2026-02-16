import { getBaseUrl } from "./base";

export function inferCategory(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.match(/t-shirt|hoodie|sweatshirt|jacket|shirt|tank|top|long sleeve|short sleeve/)) return "Apparel";
  if (lowerName.match(/hat|cap|beanie|bag|tote|phone case|sticker|patch|backpack/)) return "Accessories";
  if (lowerName.match(/poster|canvas|print|wall art/)) return "Art & Prints";
  if (lowerName.match(/mug|pillow|towel|blanket|apron/)) return "Home & Living";
  return "Equipment";
}

export async function getProduct(id) {
  try {
    const base = getBaseUrl();
    const detailUrl = `${base}/api/printful/store-products?productId=${id}`;
    const res = await fetch(detailUrl, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const data = json.data;

    if (!data || !data.sync_product) return null;

    const product = data.sync_product;
    const variants = data.sync_variants || [];

    // Process variants to get unique images and options
    const processedVariants = variants.map((v) => ({
      id: v.id,
      name: v.name,
      retail_price: v.retail_price,
      currency: v.currency,
      image: v.files.find((f) => f.type === "preview")?.preview_url || product.thumbnail_url,
      size: v.size, // Assuming size/color might be in name or separate fields if available
      color: v.color,
      availability_status: v.availability_status,
    }));

    // Collect all unique images
    const images = [
      { id: "main", url: product.thumbnail_url, alt: product.name },
      ...processedVariants
        .map((v) => ({ id: v.id, url: v.image, alt: v.name }))
        .filter(
          (img, index, self) => img.url !== product.thumbnail_url && index === self.findIndex((t) => t.url === img.url),
        ),
    ];

    return {
      id: product.id,
      name: product.name,
      description: product.name, // Printful API might not return full description in this endpoint
      price: processedVariants[0]?.retail_price || "0.00",
      images: images,
      variants: processedVariants,
      category: inferCategory(product.name),
      external_id: product.external_id,
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

export async function getProducts({ limit = 20, offset = 0 } = {}) {
  try {
    const base = getBaseUrl();
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    const res = await fetch(`${base}/api/printful/store-products?${params.toString()}`, {
      next: { revalidate: 360 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items = json.data || [];

    // Fetch details for each product to get at least one variant ID
    const productsWithVariants = await Promise.all(
      items.map(async (product) => {
        try {
          const detailUrl = `${base}/api/printful/store-products?productId=${product.id}`;
          const detailRes = await fetch(detailUrl, {
            next: { revalidate: 3600 },
          });

          if (detailRes.ok) {
            const detailJson = await detailRes.json();
            // In our API response, the data is the product object itself
            const productDetail = detailJson.data;
            const sync_variants = productDetail?.sync_variants;

            // Get the first synced variant ID
            const firstVariant = sync_variants?.find((v) => v.synced) || sync_variants?.[0];

            if (!firstVariant) {
              console.warn(
                `⚠️ No variants found for product: ${product.name}. Detail data:`,
                JSON.stringify(productDetail).substring(0, 100),
              );
            }

            const numericPrice = firstVariant ? parseFloat(firstVariant.retail_price) : 25.0;
            const category = inferCategory(product.name);

            return {
              id: product.id,
              name: product.name,
              image: product.thumbnail_url,
              imageAlt: product.name,
              price: firstVariant ? `$${firstVariant.retail_price} USD` : "From $25.00 USD",
              numericPrice: numericPrice,
              category: category,
              description: `${product.variants} variants available`,
              synced: product.synced,
              is_ignored: product.is_ignored,
              external_id: product.external_id,
              variant_id: firstVariant ? firstVariant.id : null,
              variants: product.variants,
              availability_status: firstVariant ? firstVariant.availability_status : "active",
            };
          } else {
            console.error(
              `❌ Failed to fetch detail for product ${product.id}: ${detailRes.status} ${detailRes.statusText}`,
            );
          }
        } catch (err) {
          console.error(`Error fetching detail for product ${product.id}:`, err);
        }

        // Fallback if detail fetch fails
        return {
          id: product.id,
          name: product.name,
          image: product.thumbnail_url,
          imageAlt: product.name,
          price: "From $25.00 USD",
          numericPrice: 25.0,
          category: inferCategory(product.name),
          description: `${product.variants} variants available`,
          synced: product.synced,
          is_ignored: product.is_ignored,
          external_id: product.external_id,
          variant_id: null,
          variants: product.variants,
        };
      }),
    );

    return productsWithVariants;
  } catch {
    return [];
  }
}
