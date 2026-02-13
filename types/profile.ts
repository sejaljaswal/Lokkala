// User Types
export interface UserData {
    id: string;
    name: string;
    email: string;
    role: "artist" | "buyer";
    bio: string;
    avatar: string;
}

// Art/Listing Types
export interface Listing {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    category: string;
    createdAt: string;
}

// Sale Types
export interface Sale {
    id: string;
    artTitle: string;
    artImage: string;
    buyerName: string;
    price: number;
    purchasedAt: string;
}

// Purchase Types
export interface Purchase {
    id: string;
    artTitle: string;
    artImage: string;
    artCategory: string;
    artistName: string;
    price: number;
    purchasedAt: string;
}

// Artist Stats
export interface ArtistStats {
    listings: Listing[];
    sales: Sale[];
    totalSales: number;
    listingsCount: number;
    salesCount: number;
}

// Buyer Stats
export interface BuyerStats {
    purchases: Purchase[];
    totalSpent: number;
    purchaseCount: number;
}

// Profile Stats Props
export interface ProfileStatsData {
    listingsCount?: number;
    salesCount?: number;
    totalSales?: number;
    purchaseCount?: number;
    totalSpent?: number;
}
