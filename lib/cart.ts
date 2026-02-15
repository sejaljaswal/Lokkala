// Cart utility functions with localStorage persistence

export interface CartItem {
    id: string;
    title: string;
    artistName: string;
    price: number;
    image: string;
    quantity: number;
}

const CART_STORAGE_KEY = "lokkala_cart";

// Get cart from localStorage
export const getCart = (): CartItem[] => {
    if (typeof window === "undefined") return [];
    
    try {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error("Error reading cart from localStorage:", error);
        return [];
    }
};

export const saveCart = (cart: CartItem[]): void => {
    if (typeof window === "undefined") return;
    
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        // Dispatch custom event for cart updates
        window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
};

// Add item to cart
export const addToCart = (item: Omit<CartItem, "quantity">): void => {
    const cart = getCart();
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
        // Item already exists, increment quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item with quantity 1
        cart.push({ ...item, quantity: 1 });
    }

    saveCart(cart);
};

// Remove item from cart
export const removeFromCart = (itemId: string): void => {
    const cart = getCart();
    const updatedCart = cart.filter((item) => item.id !== itemId);
    saveCart(updatedCart);
};

// Update item quantity
export const updateCartItemQuantity = (itemId: string, quantity: number): void => {
    if (quantity < 1) return;
    
    const cart = getCart();
    const itemIndex = cart.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        saveCart(cart);
    }
};

// Get cart count
export const getCartCount = (): number => {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
};

// Clear cart
export const clearCart = (): void => {
    saveCart([]);
};

// Get cart total
export const getCartTotal = (): number => {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};
