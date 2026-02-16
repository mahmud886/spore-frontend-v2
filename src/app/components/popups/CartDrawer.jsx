"use client";

import { useCartStore } from "@/app/lib/store/useCartStore";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, isCartOpen, toggleCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    toggleCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#050505] border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-primary" size={24} />
                <h2 className="text-xl font-bold uppercase tracking-wider">Field Equipment</h2>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p className="uppercase tracking-widest text-sm">Cart is Empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      )}
                    </div>
                    <div className="flex-grow space-y-1">
                      <h3 className="text-sm font-bold uppercase leading-tight">{item.name}</h3>
                      <p className="text-primary font-mono text-xs">{item.price}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 border border-white/5">
                          <button
                            onClick={() =>
                              updateQuantity(item.uniqueId || item.variant_id || item.id, item.quantity - 1)
                            }
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.uniqueId || item.variant_id || item.id, item.quantity + 1)
                            }
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.uniqueId || item.variant_id || item.id)}
                          className="text-white/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-4">
                <div className="flex items-center justify-between uppercase tracking-widest">
                  <span className="text-white/40 text-xs">Total Allocation</span>
                  <span className="text-xl font-bold text-primary">${getTotalPrice().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/80 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 group shadow-[0_0_20px_rgba(212,255,0,0.2)] hover:shadow-[0_0_30px_rgba(212,255,0,0.4)]"
                >
                  <CreditCard size={20} />
                  <span className="uppercase tracking-widest">Initialize Checkout</span>
                </button>
                <p className="text-[10px] text-center text-white/20 uppercase tracking-tighter">
                  Secure encrypted transmission via Stripe Neural Link
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
