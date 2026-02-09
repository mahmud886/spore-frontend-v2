"use client";

import Carousel from "../shared/Carousel";
import { SectionTitle } from "../shared/SectionTitle";
import ProductCard from "./ProductCard";

export default function ProductsSection({ products = [] }) {
  const renderProductCard = (product, index) => <ProductCard key={product.id || index} product={product} />;

  return (
    <section className="mb-24">
      <Carousel
        items={products}
        renderItem={renderProductCard}
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
        gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        titleComponent={<SectionTitle>Field Equipment</SectionTitle>}
      />
    </section>
  );
}
