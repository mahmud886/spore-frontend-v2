import { getBaseUrl } from "./base";

export async function getProducts({ limit = 20, offset = 0 } = {}) {
  const base = getBaseUrl();
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  const res = await fetch(`${base}/api/printful/store-products?${params.toString()}`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const json = await res.json();
  const items = json.data || [];
  return items.map((product) => ({
    id: product.id,
    name: product.name,
    image: product.thumbnail_url,
    imageAlt: product.name,
    price: "From $25.00 USD",
    description: `${product.variants} variants available`,
    synced: product.synced,
    is_ignored: product.is_ignored,
    external_id: product.external_id,
  }));
}
