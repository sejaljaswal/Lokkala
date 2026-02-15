"use client";

import ProfileCard from "@/components/ProfileCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { ProfileStatSkeleton, ArtListingSkeleton } from "@/components/Skeleton";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: "artist" | "buyer";
    bio: string;
    avatar: string;
}

interface ArtistStats {
    listings: Array<{
        id: string;
        title: string;
        price: number;
        imageUrl: string;
        category: string;
        createdAt: string;
    }>;
    sales: Array<{
        id: string;
        artTitle: string;
        artImage: string;
        buyerName: string;
        price: number;
        purchasedAt: string;
    }>;
    totalSales: number;
    listingsCount: number;
    salesCount: number;
}

interface BuyerStats {
    purchases: Array<{
        id: string;
        artTitle: string;
        artImage: string;
        artCategory: string;
        artistName: string;
        price: number;
        purchasedAt: string;
    }>;
    totalSpent: number;
    purchaseCount: number;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [artistStats, setArtistStats] = useState<ArtistStats | null>(null);
    const [buyerStats, setBuyerStats] = useState<BuyerStats | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch("/api/auth/me");
                
                if (!userResponse.ok) {
                    router.push("/login");
                    return;
                }

                const userData = await userResponse.json();
                setUser(userData.user);
                
                // Debug: Log the user role
                console.log("User data from API:", userData.user);
                console.log("User role:", userData.user.role);

                // Fetch role-specific stats
                if (userData.user.role === "artist") {
                    const statsResponse = await fetch("/api/profile/artist-stats");
                    if (statsResponse.ok) {
                        const stats = await statsResponse.json();
                        setArtistStats(stats);
                    }
                } else if (userData.user.role === "buyer") {
                    const statsResponse = await fetch("/api/profile/buyer-stats");
                    if (statsResponse.ok) {
                        const stats = await statsResponse.json();
                        setBuyerStats(stats);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-64px)] bg-cream-50 py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 text-center">
                        <div className="h-3 bg-beige-200 rounded w-32 mx-auto mb-2 animate-shimmer"></div>
                        <div className="h-10 bg-beige-200 rounded w-48 mx-auto animate-shimmer"></div>
                    </div>
                    
                    {/* Profile Card Skeleton */}
                    <div className="bg-beige-100 rounded-3xl p-8 mb-8 border border-beige-200">
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-beige-200 animate-shimmer mb-4"></div>
                            <div className="h-8 bg-beige-200 rounded w-40 mb-2 animate-shimmer"></div>
                            <div className="h-4 bg-beige-200 rounded w-64 animate-shimmer"></div>
                        </div>
                    </div>

                    {/* Stats Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[...Array(3)].map((_, i) => (
                            <ProfileStatSkeleton key={i} />
                        ))}
                    </div>

                    {/* Listings Skeleton */}
                    <div className="mt-8">
                        <div className="h-8 bg-beige-200 rounded w-48 mb-6 animate-shimmer"></div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <ArtListingSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-[calc(100vh-64px)] bg-cream-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-sm font-bold text-earth-brown-600 uppercase tracking-[0.2em] mb-2">Member Profile</h2>
                    <h1 className="text-4xl font-extrabold text-earth-brown-800">Account Overview</h1>
                </div>

                <ProfileCard
                    avatar={user.avatar}
                    name={user.name}
                    bio={user.bio || "No bio yet. Share your story with the community!"}
                    role={user.role === "artist" ? "Artist" : "Buyer"}
                />

                {/* Orders Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => router.push("/orders")}
                        className="bg-earth-brown-800 text-cream-50 py-3 px-8 rounded-xl font-bold shadow-lg hover:bg-earth-brown-900 transition-all hover:shadow-beige-200 flex items-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        View My Orders
                    </button>
                </div>

                {/* Artist Stats */}
                {user.role === "artist" && artistStats && (
                    <div className="mt-12 space-y-8">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                                <h3 className="text-sm font-bold text-earth-brown-600 uppercase tracking-widest mb-2">Total Listings</h3>
                                <p className="text-4xl font-extrabold text-earth-brown-800">{artistStats.listingsCount}</p>
                            </div>
                            <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                                <h3 className="text-sm font-bold text-earth-brown-600 uppercase tracking-widest mb-2">Total Sales</h3>
                                <p className="text-4xl font-extrabold text-earth-brown-800">{artistStats.salesCount}</p>
                            </div>
                            <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                                <h3 className="text-sm font-bold text-earth-brown-600 uppercase tracking-widest mb-2">Revenue</h3>
                                <p className="text-4xl font-extrabold text-earth-brown-800">₹{artistStats.totalSales.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* My Listings */}
                        <div className="bg-beige-100 rounded-3xl p-8 border-2 border-beige-200 shadow-xl">
                            <h2 className="text-2xl font-extrabold text-earth-brown-800 mb-6">My Art Listings</h2>
                            {artistStats.listings.length === 0 ? (
                                <p className="text-earth-brown-600 italic">No listings yet. Start uploading your artwork!</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {artistStats.listings.map(art => (
                                        <div key={art.id} className="bg-cream-50 rounded-xl overflow-hidden border border-beige-200 hover:shadow-lg transition-shadow">
                                            <div className="relative h-48 bg-beige-200">
                                                <Image
                                                    src={art.imageUrl}
                                                    alt={art.title}
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                    unoptimized={true}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-earth-brown-800 truncate">{art.title}</h3>
                                                <p className="text-sm text-earth-brown-600">{art.category}</p>
                                                <p className="text-lg font-bold text-earth-brown-800 mt-2">₹{art.price.toLocaleString()}</p>
                                                
                                                {/* Action Buttons */}
                                                <div className="flex gap-2 mt-4">
                                                    <button
                                                        onClick={() => router.push(`/art/${art.id}/edit`)}
                                                        className="flex-1 bg-earth-brown-800 text-cream-50 py-2 rounded-lg font-semibold hover:bg-earth-brown-900 transition-all duration-300 text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Are you sure you want to delete this artwork?')) {
                                                                try {
                                                                    const res = await fetch(`/api/art/${art.id}`, {
                                                                        method: 'DELETE',
                                                                    });
                                                                    if (res.ok) {
                                                                        showToast('Artwork deleted successfully', 'success');
                                                                        window.location.reload();
                                                                    } else {
                                                                        showToast('Failed to delete artwork', 'error');
                                                                    }
                                                                } catch (error) {
                                                                    console.error('Error deleting art:', error);
                                                                    showToast('Error deleting artwork', 'error');
                                                                }
                                                            }
                                                        }}
                                                        className="flex-1 bg-red-600 text-cream-50 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sales History */}
                        {artistStats.sales.length > 0 && (
                            <div className="bg-beige-100 rounded-3xl p-8 border-2 border-beige-200 shadow-xl">
                                <h2 className="text-2xl font-extrabold text-earth-brown-800 mb-6">Sales History</h2>
                                <div className="space-y-4">
                                    {artistStats.sales.map(sale => (
                                        <div key={sale.id} className="bg-cream-50 rounded-xl p-4 border border-beige-200 flex items-center gap-4">
                                            <div className="relative h-16 w-16 flex-shrink-0 bg-beige-200 rounded-lg overflow-hidden">
                                                {sale.artImage && (
                                                    <Image
                                                        src={sale.artImage}
                                                        alt={sale.artTitle}
                                                        fill
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                        }}
                                                        unoptimized={true}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-earth-brown-800">{sale.artTitle}</h3>
                                                <p className="text-sm text-earth-brown-600">Sold to: {sale.buyerName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-earth-brown-800">₹{sale.price.toLocaleString()}</p>
                                                <p className="text-xs text-earth-brown-600">{new Date(sale.purchasedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Buyer Stats */}
                {user.role === "buyer" && buyerStats && (
                    <div className="mt-12 space-y-8">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                                <h3 className="text-sm font-bold text-earth-brown-600 uppercase tracking-widest mb-2">Total Purchases</h3>
                                <p className="text-4xl font-extrabold text-earth-brown-800">{buyerStats.purchaseCount}</p>
                            </div>
                            <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                                <h3 className="text-sm font-bold text-earth-brown-600 uppercase tracking-widest mb-2">Total Spent</h3>
                                <p className="text-4xl font-extrabold text-earth-brown-800">₹{buyerStats.totalSpent.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Purchase History */}
                        <div className="bg-beige-100 rounded-3xl p-8 border-2 border-beige-200 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-extrabold text-earth-brown-800">My Collection</h2>
                                <button
                                    className="bg-earth-brown-800 text-cream-50 py-2 px-6 rounded-xl font-bold shadow-lg hover:bg-earth-brown-900 transition-all hover:shadow-beige-200"
                                    onClick={() => router.push('/wishlist')}
                                >
                                    View Wishlist
                                </button>
                            </div>
                            {buyerStats.purchases.length === 0 ? (
                                <p className="text-earth-brown-600 italic">No purchases yet. Start collecting unique artworks!</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {buyerStats.purchases.map(purchase => (
                                        <div key={purchase.id} className="bg-cream-50 rounded-xl overflow-hidden border border-beige-200 hover:shadow-lg transition-shadow">
                                            <div className="relative h-48 bg-beige-200">
                                                <Image
                                                    src={purchase.artImage}
                                                    alt={purchase.artTitle}
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                    unoptimized={true}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-earth-brown-800 truncate">{purchase.artTitle}</h3>
                                                <p className="text-sm text-earth-brown-600">by {purchase.artistName}</p>
                                                <p className="text-sm text-earth-brown-500">{purchase.artCategory}</p>
                                                <div className="mt-2 flex justify-between items-center">
                                                    <p className="text-lg font-bold text-earth-brown-800">₹{purchase.price.toLocaleString()}</p>
                                                    <p className="text-xs text-earth-brown-600">{new Date(purchase.purchasedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
