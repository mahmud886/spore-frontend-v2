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
        // Use variant_id for uniqueness if available, otherwise product id
        const uniqueId = product.variant_id || product.id;

        // Find existing item with same unique ID
        const existingItem = currentItems.find((item) => (item.variant_id || item.id) === uniqueId);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              (item.variant_id || item.id) === uniqueId
                ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
                : item,
            ),
          });
        } else {
          // Ensure we store the uniqueId so we can reliably find/remove it later
          // We can use a composite key or just ensure variant_id is set
          set({ items: [...currentItems, { ...product, uniqueId, quantity: product.quantity || 1 }] });
        }
        set({ isCartOpen: true });
      },

      removeItem: (identifier) => {
        // identifier can be uniqueId (variant_id or product_id)
        set({
          items: get().items.filter((item) => {
            const itemId = item.uniqueId || item.variant_id || item.id;
            return itemId !== identifier;
          }),
        });
      },

      updateQuantity: (identifier, quantity) => {
        if (quantity <= 0) {
          get().removeItem(identifier);
          return;
        }
        set({
          items: get().items.map((item) => {
            const itemId = item.uniqueId || item.variant_id || item.id;
            return itemId === identifier ? { ...item, quantity } : item;
          }),
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
