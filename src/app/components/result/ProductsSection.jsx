"use client";

import { useEffect, useState } from "react";
import Carousel from "../shared/Carousel";
import { SectionTitle } from "../shared/SectionTitle";
import ShimmerCard from "../shared/ShimmerCard";
import ProductCard from "./ProductCard";

export default function ProductsSection({ products: productsProp }) {
  const [printfulProducts, setPrintfulProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrintfulProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/printful/store-products?limit=20");

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data);

        if (data.success && Array.isArray(data.data)) {
          // Transform Printful products to match the component's expected format
          const transformedProducts = data.data.map((product) => ({
            id: product.id,
            name: product.name,
            image: product.thumbnail_url,
            imageAlt: product.name,
            price: "From $25.00 USD", // Printful prices vary by variant
            description: `${product.variants} variants available`,
            synced: product.synced,
            is_ignored: product.is_ignored,
            external_id: product.external_id,
          }));

          setPrintfulProducts(transformedProducts);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching Printful products:", err);
        setError(err.message);
        // Fallback to static products if API fails
        setPrintfulProducts([
          {
            name: "Sector 7 Hoodie",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYMAhjmCLTUx0Zkb6f3EMLP8rQhR9iroHWWpX_TlTLixHIAAuL-QJAyzrNUcyg95WkLR7AnfYn3jkT34Kb8Zmfgq1cnwk7lndDy_5N5YLjuqlkRj__Bk-XxJ4MPnI7eAVEEjf-2NtAdLHxEw1G4QUy81m9YaNn-QfxkSO7O-YTYRj5XB6Wq2WQJMwl6ZHmlDRq6cf81xnuB7BRgWJ2D_Kv1r_X_es5QICpPkKz6C0y8aqb8z6-No-r_k9M93z7lLinHa1LVN7qJc",
            imageAlt: "Sector 7 Hoodie",
            price: "$85.00 USD",
            description: "Armor Class: Light",
            badge: "Limited Drop",
          },
          {
            name: "Tactical Tee",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuB8QXgLcBaM0E6_5QjpDf3CLGAC-nwYHpM1nVikgbXXJGP9U5dHqBDkFYu4rNx_UtNoEIyd8-yWCA3GoxVo4uCxDSSjNG8DcfZquOYuuxff0q8AqK8JP8MvRWbGE_5SgZKsFdUugEfzMLphkvc1Kfum2ZY4NIll1V1igS8Nz5Ol13oijz_zVJoSN1yv2UBCgBoj6owLVGz1QKhqeeoG3VzggJMn_N2aglhkGdoqq37g-2CGRDEW7UXYC0x7SSJuQ87p0v-TzYX05PY",
            imageAlt: "Tactical Tee",
            price: "$45.00 USD",
            description: "Durability: High",
          },
          {
            name: "Spore Vial (Prop)",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBvaHzV298zW-ZbC2gQNEZNPyXu_vRppXSNIq81ueErVX1aVzKX2U3Xmi3959yB_74PlN5cDEmWZEKCV8cXBRNQQOVsJCTWrOEpSmK1oydMwKsqr_F88Pkr9ZybuoODzYO5a8JQWs9_BWqX1CiO4yX8EGMHXIskdu61SWAd4KWYFJDmBv27ZbEfC0QPfZvKang1QuYSUaVCPMXm2532zpQv_0MfmibBm4DD3s0vplNitCqTio8xSM_w25npVMqwzhUvt3ucOJAvS-w",
            imageAlt: "Spore Vial",
            price: "$120.00 USD",
            warning: "Warning: Biohazard",
            imageEffect: "blur",
            imageWidth: 300,
            imageHeight: 300,
          },
          {
            name: "Field Manual",
            price: "$35.00 USD",
            description: "Knowledge Base",
            customContent: (
              <div className="w-2/3 h-3/4 bg-white/10 border border-white/20 p-4 font-mono text-[6px] text-white/40">
                <div className="border-b border-white/20 mb-2 pb-1">TECHNICAL MANUAL</div>
                <div className="space-y-1">
                  <div>- SECTOR PROTOCOL</div>
                  <div>- HAZARD CODES</div>
                  <div>- CONTAINMENT GUIDES</div>
                </div>
              </div>
            ),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrintfulProducts();
  }, []);

  // Use Printful products if available, otherwise use prop or fallback
  const productsToDisplay = printfulProducts.length > 0 ? printfulProducts : productsProp || [];

  const renderProductCard = (product, index) => <ProductCard key={product.id || index} product={product} />;

  // Render shimmer cards during loading
  const renderShimmerCard = (index) => <ShimmerCard key={`shimmer-${index}`} />;

  if (loading) {
    return (
      <section className="mb-24">
        <SectionTitle>Field Equipment</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => renderShimmerCard(index))}
        </div>
      </section>
    );
  }

  if (error) {
    console.warn("Using fallback products due to error:", error);
  }

  return (
    <section className="mb-24">
      <Carousel
        items={productsToDisplay}
        renderItem={renderProductCard}
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
        gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        titleComponent={<SectionTitle>Field Equipment</SectionTitle>}
      />
    </section>
  );
}
