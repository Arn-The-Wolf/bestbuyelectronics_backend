import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    discount_price: number | null;
    image_url: string | null;
    quantity: number;
}

interface CartStore {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: [],
            addToCart: (product) => {
                const { cart } = get();
                const existingItem = cart.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        cart: cart.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        cart: [
                            ...cart,
                            {
                                id: product.id,
                                name: product.name,
                                price: Number(product.price),
                                discount_price: product.discount_price ? Number(product.discount_price) : null,
                                image_url: product.image_url,
                                quantity: 1,
                            },
                        ],
                    });
                }
            },
            removeFromCart: (productId) => {
                set({ cart: get().cart.filter((item) => item.id !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                const { cart } = get();
                if (quantity <= 0) {
                    set({ cart: cart.filter((item) => item.id !== productId) });
                } else {
                    set({
                        cart: cart.map((item) =>
                            item.id === productId ? { ...item, quantity } : item
                        ),
                    });
                }
            },
            clearCart: () => set({ cart: [] }),
            getCartTotal: () => {
                return get().cart.reduce((total, item) => {
                    const price = item.discount_price || item.price;
                    return total + price * item.quantity;
                }, 0);
            },
            getCartCount: () => {
                return get().cart.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage', // unique name for localStorage key
        }
    )
);
