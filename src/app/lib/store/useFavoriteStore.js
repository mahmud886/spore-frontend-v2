import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavoriteStore = create()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (product) => {
        const currentFavorites = get().favorites;
        if (!currentFavorites.find((item) => item.id === product.id)) {
          set({ favorites: [...currentFavorites, product] });
        }
      },

      removeFavorite: (productId) => {
        set({
          favorites: get().favorites.filter((item) => item.id !== productId),
        });
      },

      isFavorite: (productId) => {
        return get().favorites.some((item) => item.id === productId);
      },

      toggleFavorite: (product) => {
        const { favorites } = get();
        const exists = favorites.find((item) => item.id === product.id);
        if (exists) {
          set({ favorites: favorites.filter((item) => item.id !== product.id) });
        } else {
          set({ favorites: [...favorites, product] });
        }
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "spore-favorite-storage",
    },
  ),
);
