// Cart utility functions with API-based persistence

export interface CartItem {
    id: string;
    title: string;
    artistName: string;
    price: number;
    image: string;
    quantity: number;
}

// Get cart from server
export const getCart = async (): Promise<CartItem[]> => {
    try {
        const res = await fetch("/api/cart");
        if (!res.ok) {
            return [];
        }
        const data = await res.json();
        
        // Transform cart data to CartItem format
        const items = data.cart?.items?.map((item: any) => ({
            id: item.artId._id,
            title: item.artId.title,
            artistName: item.artId.artist?.name || "Unknown",
            price: item.artId.price,
            image: item.artId.imageUrl,
            quantity: item.quantity,
        })) || [];
        
        return items;
    } catch (error) {
        console.error("Error fetching cart:", error);
        return [];
    }
};

// Add item to cart
export const addToCart = async (artId: string): Promise<boolean> => {
    try {
        const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ artId }),
        });

        if (res.ok) {
            window.dispatchEvent(new Event("cartUpdated"));
            return true;
        }
        
        if (res.status === 401) {
            throw new Error("Please log in to add items to cart");
        }
        
        return false;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

// Remove item from cart
export const removeFromCart = async (artId: string): Promise<boolean> => {
    try {
        const res = await fetch(`/api/cart/${artId}`, {
            method: "DELETE",
        });

        if (res.ok) {
            window.dispatchEvent(new Event("cartUpdated"));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error removing from cart:", error);
        return false;
    }
};

// Update item quantity
export const updateCartItemQuantity = async (artId: string, quantity: number): Promise<boolean> => {
    try {
        const res = await fetch(`/api/cart/${artId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
        });

        if (res.ok) {
            window.dispatchEvent(new Event("cartUpdated"));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error updating cart:", error);
        return false;
    }
};

// Get cart count
export const getCartCount = async (): Promise<number> => {
    try {
        const items = await getCart();
        return items.reduce((count, item) => count + item.quantity, 0);
    } catch (error) {
        return 0;
    }
};

// Clear cart
export const clearCart = async (): Promise<boolean> => {
    try {
        const res = await fetch("/api/cart", {
            method: "DELETE",
        });

        if (res.ok) {
            window.dispatchEvent(new Event("cartUpdated"));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error clearing cart:", error);
        return false;
    }
};

// Get cart total
export const getCartTotal = async (): Promise<number> => {
    try {
        const items = await getCart();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    } catch (error) {
        return 0;
    }
};
