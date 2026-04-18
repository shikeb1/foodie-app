import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,

      addItem: (item, restaurantId, restaurantName) => {
        const { items, restaurantId: currentRestaurantId } = get();

        // Different restaurant? Ask to clear cart
        if (currentRestaurantId && currentRestaurantId !== restaurantId) {
          return { conflict: true, restaurantName };
        }

        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
            restaurantId,
            restaurantName,
          });
        }
        toast.success(`${item.name} added to cart`);
        return { conflict: false };
      },

      removeItem: (itemId) => {
        const { items } = get();
        const updated = items.filter((i) => i.id !== itemId);
        set({
          items: updated,
          restaurantId: updated.length === 0 ? null : get().restaurantId,
          restaurantName: updated.length === 0 ? null : get().restaurantName,
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'foodrush-cart' }
  )
);

export default useCartStore;
