import { getProducts } from "@/app/lib/services/products";
import { Suspense } from "react";
import { SectionTitle } from "../shared/SectionTitle";
import ShimmerCard from "../shared/ShimmerCard";
import ProductsSection from "./ProductsSection";

async function ProductsList() {
  const products = await getProducts({ limit: 20, offset: 0 });
  return <ProductsSection products={products} />;
}

function ProductsLoading() {
  return (
    <section className="mb-24 pt-24">
      <SectionTitle>Field Equipment</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ShimmerCard key={`shimmer-${index}`} />
        ))}
      </div>
    </section>
  );
}

export default function PrintfulProducts() {
  return (
    <div id="shop">
      <Suspense fallback={<ProductsLoading />}>
        <ProductsList />
      </Suspense>
    </div>
  );
}
