"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getWishlist, removeFromWishlist, type WishlistItem } from "@/lib/wishlist";
import { addToCart as addItemToCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";
import { ProductCardSkeleton } from "@/components/Skeleton";

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                // Check authentication
                const authRes = await fetch("/api/auth/me");
                if (!authRes.ok) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }
                
                setIsAuthenticated(true);
                const items = await getWishlist();
                setWishlist(items);
            } catch (error) {
                console.error("Error loading wishlist:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadWishlist();
        
        const handleWishlistUpdate = () => {
            loadWishlist();
        };
        
        window.addEventListener("wishlistUpdated", handleWishlistUpdate);
        return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    }, []);

    const handleRemove = async (id: string) => {
        await removeFromWishlist(id);
    };

    const addToCart = async (id: string, item: WishlistItem) => {
        try {
            await addItemToCart(id);
            showToast(`${item.title} added to cart!`, "success");
        } catch (error: any) {
            if (error.message.includes("log in")) {
                showToast("Please log in to add items to cart", "error");
                router.push("/login");
            } else {
                showToast("Failed to add to cart", "error");
            }
        }
    };

    return (
        <main className="min-h-screen bg-cream-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-extrabold text-earth-brown-800 mb-8">Your Wishlist</h1>
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : !isAuthenticated ? (
                    <div className="text-center py-20">
                        <svg className="mx-auto h-24 w-24 text-beige-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="mt-6 text-2xl font-bold text-earth-brown-800">Please log in to view your wishlist</h3>
                        <p className="mt-2 text-earth-brown-600">You need to be logged in to save your favorite items</p>
                        <div className="mt-8 flex gap-4 justify-center">
                            <Link href="/login" className="inline-block bg-earth-brown-800 text-cream-50 px-8 py-3 rounded-full font-semibold hover:bg-earth-brown-900 transition-all duration-300 shadow-lg">
                                Log In
                            </Link>
                            <Link href="/signup" className="inline-block bg-beige-200 text-earth-brown-800 px-8 py-3 rounded-full font-semibold hover:bg-beige-300 transition-all duration-300 border-2 border-beige-300">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className="mx-auto h-24 w-24 text-beige-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c2.54 0 4.04 1.54 4.5 2.09C12.46 4.54 13.96 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <h3 className="mt-6 text-2xl font-bold text-earth-brown-800">Your wishlist is empty</h3>
                        <p className="mt-2 text-earth-brown-600">Start exploring and add your favorite art pieces!</p>
                        <div className="mt-8">
                            <Link href="/shop" className="inline-block bg-earth-brown-800 text-cream-50 px-8 py-3 rounded-full font-semibold hover:bg-earth-brown-900 transition-all duration-300 shadow-lg">Browse Shop</Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlist.map(item => (
                            <div key={item.id} className="group relative bg-beige-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-2 border-beige-200/50 hover:border-earth-brown-800/20 flex flex-col h-full transform hover:-rotate-1 w-64 mx-auto">
                                {/* Image Container */}
                                <div className="relative aspect-4/5 overflow-hidden bg-beige-200 m-2 rounded-2xl h-40">
                                    <Image 
                                        src={item.image} 
                                        alt={item.title} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                        unoptimized={true}
                                    />
                                </div>
                                {/* Content */}
                                <div className="p-3 flex flex-col grow">
                                    <div className="mb-1">
                                        <p className="text-xs font-semibold text-earth-brown-600 uppercase tracking-wider">{item.artistName}</p>
                                    </div>
                                    <h3 className="text-base font-bold text-earth-brown-800 line-clamp-1 mb-2">{item.title}</h3>
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="text-lg font-extrabold text-earth-brown-900">₹{item.price.toLocaleString()}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => addToCart(item.id, item)}
                                                className="group/cart relative p-2 rounded-full bg-cream-50 text-earth-brown-600 hover:bg-earth-brown-800 hover:text-cream-50 transition-colors duration-300 border border-beige-200"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-earth-brown-900 text-cream-50 text-xs font-semibold rounded-lg opacity-0 group-hover/cart:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Add to Cart</span>
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="group/remove relative p-2 rounded-full bg-cream-50 text-red-600 hover:bg-earth-brown-800 hover:text-red-600 transition-colors duration-300 border border-beige-200"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6M9 10v6m6-6v6M10 6V4a2 2 0 012-2h0a2 2 0 012 2v2" />
                                                </svg>
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-earth-brown-900 text-cream-50 text-xs font-semibold rounded-lg opacity-0 group-hover/remove:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
