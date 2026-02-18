import { Wrapper } from "@/app/components/shared/Wrapper";
import ProductDetailClient from "@/app/components/shop/ProductDetailClient";
import { getProduct, getProducts } from "@/app/lib/services/products";
import { notFound } from "next/navigation";

export async function generateMetadata(props) {
  const params = await props.params;
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: "Product Not Found | SPORE",
    };
  }

  const title = `${product.name} | SPORE`;
  const description =
    product.description !== product.name
      ? product.description.substring(0, 160) // SEO best practice: limit description length
      : `Experience the ultimate in cyber-tactical gear with the ${product.name}. Buy now at SPORE.`;

  // Use first image or thumbnail
  const imageUrl = product.images?.[0]?.url || product.thumbnail_url || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://sporefall.com/shop/${product.id}`, // Ideally use env var for base URL
      siteName: "SPORE",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage(props) {
  const params = await props.params;
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Fetch related products (simple implementation: same category or random)
  const allProducts = await getProducts({ limit: 10 });

  // Filter out current product and try to match category
  const relatedProducts = allProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  // If not enough related products, fill with others
  if (relatedProducts.length < 4) {
    const others = allProducts
      .filter((p) => p.id !== product.id && !relatedProducts.find((rp) => rp.id === p.id))
      .slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...others);
  }

  return (
    <main className="min-h-screen pt-32 pb-20 ">
      <Wrapper>
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </Wrapper>
    </main>
  );
}
