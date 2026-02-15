import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      setCartOpen: (open) => set({ isCartOpen: open }),

      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item,
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
        set({ isCartOpen: true });
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) => (item.id === productId ? { ...item, quantity } : item)),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
          return total + price * (item.quantity || 1);
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + (item.quantity || 1), 0);
      },
    }),
    {
      name: "spore-cart-storage",
    },
  ),
);
