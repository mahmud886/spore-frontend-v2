"use client";

import ProductCard from "@/app/components/home/ProductCard";
import ShareModal from "@/app/components/popups/ShareModal";
import { useCartStore } from "@/app/lib/store/useCartStore";
import { useFavoriteStore } from "@/app/lib/store/useFavoriteStore";
import { ArrowLeft, Heart, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductImageGallery from "./ProductImageGallery";

export default function ProductDetailClient({ product, relatedProducts = [] }) {
  const addItem = useCartStore((state) => state.addItem);
  const { isFavorite, toggleFavorite } = useFavoriteStore();

  // State
  const [selectedVariant, setSelectedVariant] = useState(() => {
    if (!product.variants || product.variants.length === 0) return null;
    // Prioritize first active variant
    const firstActive = product.variants.find((v) => v.availability_status === "active");
    return firstActive || product.variants[0];
  });
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Wrap in timeout to avoid synchronous setState warning
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Images logic: Combine main product image + variant images, deduped
  const images = product.images || [];

  // Helper to check availability
  const isVariantAvailable = (variant) => {
    if (!variant) return false;
    // If availability_status is undefined, assume available (legacy/fallback)
    // If it is defined, check if it's 'active'
    return !variant.availability_status || variant.availability_status === "active";
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    // Try to find the image associated with this variant
    const variantImageIndex = images.findIndex((img) => img.url === variant.image);
    if (variantImageIndex !== -1) {
      setCurrentImageIndex(variantImageIndex);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const productToAdd = {
      ...product,
      id: product.id,
      variant_id: selectedVariant.id,
      name: `${product.name} (${selectedVariant.name.replace(product.name + " - ", "")})`,
      price: selectedVariant.retail_price,
      image: selectedVariant.image || images[0]?.url,
      quantity: quantity,
    };

    addItem(productToAdd);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb / Back */}
      <div className="mb-8">
        <Link href="/shop" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left Column - Image Gallery */}
        <ProductImageGallery
          images={images}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
          productName={product.name}
        />

        {/* Right Column - Product Info */}
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1
                  className="text-3xl md:text-4xl font-bold text-white mb-2 cyber-glitch-text"
                  data-text={product.name}
                >
                  {product.name}
                </h1>
                <p className="text-gray-400 text-sm">{product.category}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(product)}
                  className={`p-2 transition-colors ${
                    isClient && isFavorite(product.id)
                      ? "text-red-500 hover:text-red-400"
                      : "text-gray-400 hover:text-primary"
                  }`}
                  title={isClient && isFavorite(product.id) ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Heart
                    size={20}
                    fill={isClient && isFavorite(product.id) ? "currentColor" : "none"}
                    className="transition-transform active:scale-90"
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-primary transition-colors"
                  title="Share Product"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-3xl font-bold text-primary">
                {selectedVariant ? `$${selectedVariant.retail_price}` : "Unavailable"}
              </span>
              {selectedVariant && (
                <div className="flex flex-col items-start">
                  <span className="text-gray-500 text-sm">USD</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm mt-1 ${
                      isVariantAvailable(selectedVariant)
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {isVariantAvailable(selectedVariant) ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          {product.variants.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">Select Option</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  // Extract simplified name
                  // 1. Remove product name
                  let variantName = variant.name;
                  if (variantName.startsWith(product.name)) {
                    variantName = variantName.substring(product.name.length);
                  }
                  // 2. Remove leading separators ( - , | , / , etc)
                  variantName = variantName.replace(/^[\s\-\|\/]+/, "");

                  // 3. Fallback if empty (e.g. if variant name equals product name)
                  if (!variantName.trim()) {
                    if (variant.size || variant.color) {
                      variantName = [variant.size, variant.color].filter(Boolean).join(" - ");
                    } else {
                      variantName = "Standard";
                    }
                  }

                  const isSelected = selectedVariant?.id === variant.id;
                  const available = isVariantAvailable(variant);

                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variant)}
                      className={`px-3 py-2 text-xs md:text-sm rounded-md border transition-all duration-300 relative overflow-hidden group ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                          : available
                            ? "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                            : "border-red-900/30 text-red-700/50 hover:border-red-900/50 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {variantName}
                        {!available && <span className="text-[8px] text-red-500 uppercase font-bold">Sold Out</span>}
                      </span>
                      {isSelected && <div className="absolute inset-0 bg-primary/5 cyber-scanline"></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center bg-black/40 border border-white/10 rounded-lg w-fit">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1 || !isVariantAvailable(selectedVariant)}
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium text-white">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isVariantAvailable(selectedVariant)}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || isAdded || !isVariantAvailable(selectedVariant)}
              className={`flex-1 py-3 px-6 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                isAdded
                  ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                  : !selectedVariant || !isVariantAvailable(selectedVariant)
                    ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
                    : "bg-primary text-black hover:bg-primary-light hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)]"
              }`}
            >
              {isAdded ? (
                <>Added to Cart</>
              ) : !selectedVariant ? (
                <>Unavailable</>
              ) : !isVariantAvailable(selectedVariant) ? (
                <>Out of Stock</>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none pt-8 border-t border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">Description</h3>
            <p className="text-gray-400 leading-relaxed">
              {product.description !== product.name
                ? product.description
                : `Experience the ultimate in cyber-tactical gear with the ${product.name}. Designed for the modern urban operator, this item combines futuristic aesthetics with premium durability. Perfect for your daily missions in the concrete jungle.`}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-primary text-sm font-bold mb-1">PREMIUM MATERIALS</h4>
                <p className="text-xs text-gray-400">High-quality construction for maximum durability.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-primary text-sm font-bold mb-1">CYBER AESTHETIC</h4>
                <p className="text-xs text-gray-400">Futuristic design language inspired by cyberpunk culture.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-white/10 pt-12">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-primary block"></span>
            Related Equipment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`Check out ${product.name}`}
      />
    </div>
  );
}
