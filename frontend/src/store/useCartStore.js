import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set, get) => ({
            cartItems: [],

            addToCart: (product) => {
                set((state) => {
                    const existingItem = state.cartItems.find((item) => item.id === product.id);
                    if (existingItem) {
                        return {
                            cartItems: state.cartItems.map((item) =>
                                item.id === product.id
                                    ? { ...item, cartQuantity: (item.cartQuantity || 1) + 1 }
                                    : item
                            ),
                        };
                    }
                    return {
                        cartItems: [...state.cartItems, { ...product, cartQuantity: 1 }],
                    };
                });
                get().showNotification(`${product.name} added to cart!`);
            },

            removeFromCart: (productId) => {
                set((state) => ({
                    cartItems: state.cartItems.filter((item) => item.id !== productId),
                }));
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                set((state) => ({
                    cartItems: state.cartItems.map((item) =>
                        item.id === productId ? { ...item, cartQuantity: quantity } : item
                    ),
                }));
            },

            increaseQuantity: (productId) => {
                set((state) => ({
                    cartItems: state.cartItems.map((item) =>
                        item.id === productId
                            ? { ...item, cartQuantity: (item.cartQuantity || 1) + 1 }
                            : item
                    ),
                }));
            },

            decreaseQuantity: (productId) => {
                set((state) => ({
                    cartItems: state.cartItems
                        .map((item) => {
                            if (item.id === productId) {
                                const newQty = (item.cartQuantity || 1) - 1;
                                return newQty > 0 ? { ...item, cartQuantity: newQty } : null;
                            }
                            return item;
                        })
                        .filter(Boolean),
                }));
            },

            clearCart: () => set({ cartItems: [] }),

            notification: { show: false, message: '' },

            showNotification: (message) => {
                set({ notification: { show: true, message } });
            },

            hideNotification: () => {
                set({ notification: { show: false, message: '' } });
            },

            getTotalItems: () => {
                return get().cartItems.reduce((total, item) => total + (item.cartQuantity || 1), 0);
            },

            getTotalPrice: () => {
                return get().cartItems.reduce((total, item) => {
                    const price = parseFloat(item.price) || 0;
                    const qty = item.cartQuantity || 1;
                    return total + price * qty;
                }, 0);
            },
        }),
        {
            name: 'vcoop-cart-storage',
            storage: createJSONStorage(() => sessionStorage), // Secure: cleared when tab/browser closes
        }
    )
);

export default useCartStore;
