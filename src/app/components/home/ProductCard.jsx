"use client";

import { useCartStore } from "@/app/lib/store/useCartStore";
import { Eye, ShoppingCart, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedCard } from "../shared/AnimatedWrapper";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const {
    id,
    name,
    image,
    imageAlt,
    price,
    description,
    badge,
    warning,
    customContent,
    imageEffect,
    imageWidth = 400,
    imageHeight = 400,
    variants,
    availability_status,
  } = product;

  // Logic:
  // If > 1 variant, we must go to detail page to select option.
  // If 1 variant, we can add to cart directly (unless out of stock).
  const hasVariants = variants > 1;
  const isOutOfStock = !hasVariants && availability_status && availability_status !== "active";

  return (
    <AnimatedCard hoverGlow={true} hoverFloat={true}>
      <Link href={`/shop/${id}`} className="block h-full">
        <div
          className="bg-black/50 border border-white/5 p-4 hover:border-primary/30 transition-colors group h-full cyber-holographic cyber-neon-trail flex flex-col"
          style={{
            borderTopRightRadius: "20px",
            borderBottomLeftRadius: "20px",
          }}
        >
          <div
            className={`aspect-square bg-black/40 relative mb-4 overflow-hidden flex-shrink-0 ${
              customContent ? "flex items-center justify-center" : ""
            }`}
            style={{
              borderTopRightRadius: "20px",
              borderBottomLeftRadius: "20px",
            }}
          >
            {imageEffect === "blur" && <div className="w-24 h-48 bg-cyan-500/20 rounded-full blur-2xl absolute"></div>}
            {image ? (
              <Image
                alt={imageAlt || name}
                className={`${
                  customContent ? "relative z-10 w-2/3 h-2/3 object-contain" : "w-full h-full object-cover"
                }`}
                src={image}
                width={imageWidth}
                height={imageHeight}
                unoptimized
              />
            ) : (
              customContent
            )}
            {badge && (
              <div className="absolute top-0 left-0 bg-red-600 text-[8px] font-bold px-2 py-0.5 uppercase">{badge}</div>
            )}
          </div>
          <div className="space-y-2 flex-grow flex flex-col justify-between">
            <div className="flex justify-between items-start">
              {/* Limit product name to 2 lines with ellipsis */}
              <h3 className="text-sm font-bold uppercase line-clamp-2 h-10 group-hover:text-primary transition-colors">
                {name}
              </h3>
            </div>
            <div className="flex justify-between items-end">
              <div>
                {warning ? (
                  <p className="text-[9px] text-red-500 uppercase">{warning}</p>
                ) : (
                  <p className="text-[9px] text-white/40 uppercase line-clamp-1">{description}</p>
                )}
                <p className="text-[12px] font-mono text-primary mt-1">{price}</p>
              </div>
              <button
                onClick={(e) => {
                  if (isOutOfStock) {
                    e.preventDefault();
                    // Optional: show toast/message, but button is visually disabled
                    return;
                  }
                  if (!hasVariants) {
                    e.preventDefault();
                    addItem(product);
                  }
                  // If has variants, let the Link handle navigation
                }}
                disabled={isOutOfStock}
                className={`p-2 transition-all duration-300 rounded-lg group/btn flex items-center justify-center bg-white/5 ${
                  isOutOfStock
                    ? "opacity-50 cursor-not-allowed bg-red-900/20 text-red-500"
                    : "hover:bg-primary hover:text-black"
                }`}
                title={hasVariants ? "View Details" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
              >
                {hasVariants ? (
                  <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                ) : isOutOfStock ? (
                  <XCircle size={16} className="group-hover/btn:scale-110 transition-transform" />
                ) : (
                  <ShoppingCart size={16} className="group-hover/btn:scale-110 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </AnimatedCard>
  );
}
