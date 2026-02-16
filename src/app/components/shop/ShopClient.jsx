"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/app/components/home/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown, X, Filter } from "lucide-react";

const CATEGORIES = ["All", "Apparel", "Accessories", "Art & Prints", "Home & Living", "Equipment"];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
  { label: "Name: Z-A", value: "name-desc" },
];

export default function ShopClient({ initialProducts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(lowerQuery));
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.numericPrice - b.numericPrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.numericPrice - a.numericPrice);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Featured - keep original order (or by ID/date if available)
        break;
    }

    return result;
  }, [initialProducts, searchQuery, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("featured");
  };

  return (
    <div className="space-y-8">
      {/* Controls Container */}
      <div className="sticky top-24 z-30 space-y-4">
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 md:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          {/* Decorative Cyber Lines */}
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary/50 transition-colors" />
          <div className="absolute top-0 right-0 w-1 h-full bg-primary/20 group-hover:bg-primary/50 transition-colors" />

          <div className="flex flex-col gap-6">
            {/* Top Row: Search & Sort */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search Bar */}
              <div className="relative w-full md:flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                <input
                  type="text"
                  placeholder="SEARCH EQUIPMENT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-sm font-mono tracking-wide focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 uppercase"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex w-full md:w-auto gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  className={`md:hidden flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black/40 border rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${isFiltersOpen ? "border-primary text-primary" : "border-white/10 text-white/60"}`}
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                >
                  <Filter size={14} />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="relative flex-1 md:w-64">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary/50">
                    <ArrowUpDown size={16} />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg pl-10 pr-8 py-3 text-sm font-mono uppercase tracking-wide focus:border-primary outline-none cursor-pointer hover:bg-white/5 transition-colors text-white/80"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-black text-white py-2">
                        {option.label.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Categories */}
            <div className={`md:block ${isFiltersOpen ? "block" : "hidden"}`}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-primary" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                    Category Filter
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                        selectedCategory === category
                          ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(194,255,1,0.3)] scale-105"
                          : "bg-transparent text-white/40 border-white/10 hover:border-primary/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info Bar */}
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-white/40 px-2 border-b border-white/5 pb-4">
        <span>
          Target Acquired: <span className="text-primary">{filteredProducts.length}</span> Items
        </span>
        {(searchQuery || selectedCategory !== "All" || sortBy !== "featured") && (
          <button
            onClick={resetFilters}
            className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 group"
          >
            <X size={12} className="group-hover:rotate-90 transition-transform" />
            Reset Protocols
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center border border-white/5 rounded-2xl bg-white/[0.02] border-dashed"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 border border-white/10 rounded-full animate-ping opacity-20" />
            <Search className="text-white/20" size={32} />
          </div>
          <h3 className="text-2xl font-heading text-white mb-2 uppercase tracking-widest">No Signal Detected</h3>
          <p className="text-white/40 max-w-md mx-auto mb-8 font-mono text-sm">
            No equipment matches your current search parameters. Adjust filters to re-establish connection.
          </p>
          <button
            onClick={resetFilters}
            className="bg-primary text-black px-8 py-3 rounded font-bold hover:bg-white transition-colors uppercase tracking-widest text-sm"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
