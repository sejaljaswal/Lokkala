// Wishlist utility functions with localStorage persistence

export interface WishlistItem {
    id: string;
    title: string;
    artistName: string;
    price: number;
    image: string;
}

const WISHLIST_STORAGE_KEY = "lokkala_wishlist";

export const getWishlist = (): WishlistItem[] => {
    if (typeof window === "undefined") return [];
    try {
        const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
        console.error("Error reading wishlist from localStorage:", error);
        return [];
    }
};

export const saveWishlist = (wishlist: WishlistItem[]): void => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
        window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
        console.error("Error saving wishlist to localStorage:", error);
    }
};

export const addToWishlist = (item: WishlistItem): void => {
    const wishlist = getWishlist();
    if (!wishlist.some((w) => w.id === item.id)) {
        wishlist.push(item);
        saveWishlist(wishlist);
    }
};

export const removeFromWishlist = (itemId: string): void => {
    const wishlist = getWishlist();
    const updatedWishlist = wishlist.filter((item) => item.id !== itemId);
    saveWishlist(updatedWishlist);
};

export const getWishlistCount = (): number => {
    const wishlist = getWishlist();
    return wishlist.length;
};

export const clearWishlist = (): void => {
    saveWishlist([]);
};
