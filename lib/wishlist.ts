// Wishlist utility functions with API-based persistence

export interface WishlistItem {
    id: string;
    title: string;
    artistName: string;
    price: number;
    image: string;
}

// Get wishlist from server
export const getWishlist = async (): Promise<WishlistItem[]> => {
    try {
        const res = await fetch("/api/wishlist");
        if (!res.ok) {
            return [];
        }
        const data = await res.json();
        
        // Transform wishlist data to WishlistItem format
        const items = data.wishlist?.items?.map((item: any) => ({
            id: item._id,
            title: item.title,
            artistName: item.artist?.name || "Unknown",
            price: item.price,
            image: item.imageUrl,
        })) || [];
        
        return items;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
};

// Add item to wishlist
export const addToWishlist = async (artId: string): Promise<boolean> => {
    try {
        const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ artId }),
        });

        if (res.ok) {
            window.dispatchEvent(new Event("wishlistUpdated"));
            return true;
        }
        
        if (res.status === 401) {
            throw new Error("Please log in to add items to wishlist");
        }
        
        return false;
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
    }
};

// Remove item from wishlist
export const removeFromWishlist = async (artId: string): Promise<boolean> => {
    try {
        const res = await fetch(`/api/wishlist/${artId}`, {
            method: "DELETE",
        });

        if (res.ok) {
            window.dispatchEvent(new Event("wishlistUpdated"));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        return false;
    }
};

// Get wishlist count
export const getWishlistCount = async (): Promise<number> => {
    try {
        const items = await getWishlist();
        return items.length;
    } catch (error) {
        return 0;
    }
};

// Clear wishlist
export const clearWishlist = async (): Promise<boolean> => {
    try {
        const res = await fetch("/api/wishlist", {
            method: "DELETE",
        });

        if (res.ok) {
            window.dispatchEvent(new Event("wishlistUpdated"));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error clearing wishlist:", error);
        return false;
    }
};
