"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ProductDetailSkeleton } from "@/components/Skeleton";
import { addItemToCart, AddToCartInput } from "@/lib/cart";
import { addToWishlist } from "@/lib/wishlist";
import { useToast } from "@/components/Toast";

interface Artist {
    _id: string;
    name: string;
    bio?: string;
    email: string;
}

interface Art {
    _id: string;
    title: string;
    description?: string;
    price: number;
    category: string;
    imageUrl: string;
    dimensions?: string;
    material?: string;
    artist: Artist;
}

export default function ArtDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [art, setArt] = useState<Art | null>(null);
    const [relatedArt, setRelatedArt] = useState<Art[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isWishAdding, setIsWishAdding] = useState(false);
    const [artId, setArtId] = useState<string>("");
    const { showToast } = useToast();

    useEffect(() => {
        params.then((resolvedParams) => {
            setArtId(resolvedParams.id);
        });
    }, [params]);

    useEffect(() => {
        if (!artId) return;

        const fetchArtDetails = async () => {
            try {
                const res = await fetch(`/api/art/${artId}`);
                const data = await res.json();

                if (res.ok) {
                    setArt(data.art);
                    setRelatedArt(data.relatedArt || []);
                } else {
                    console.error("Failed to fetch art details");
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtDetails();
    }, [artId]);

    const handleAddToCart = () => {
        if (!art) return;
        setIsAdding(true);
        const item: AddToCartInput = {
            id: art._id,
            title: art.title,
            artistName: art.artist.name,
            price: art.price,
            image: art.imageUrl,
        };
        addItemToCart(item);
        showToast(`${art.title} added to cart!`, "success");
        setTimeout(() => setIsAdding(false), 1000);
    };

    const handleAddToWishlist = () => {
        if (!art) return;
        setIsWishAdding(true);
        addToWishlist({
            id: art._id,
            title: art.title,
            artistName: art.artist.name,
            price: art.price,
            image: art.imageUrl,
        });
        showToast(`${art.title} added to wishlist!`, "success");
        setTimeout(() => setIsWishAdding(false), 1000);
    };

    if (loading) {
        return <ProductDetailSkeleton />;
    }

    if (!art) {
        return (
            <div className="min-h-screen bg-cream-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-earth-brown-800 mb-4">Artwork Not Found</h1>
                    <Link href="/shop" className="text-earth-brown-600 hover:underline">
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-cream-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm">
                    <Link href="/" className="text-earth-brown-600 hover:text-earth-brown-800">Home</Link>
                    <span className="mx-2 text-earth-brown-400">/</span>
                    <Link href="/shop" className="text-earth-brown-600 hover:text-earth-brown-800">Shop</Link>
                    <span className="mx-2 text-earth-brown-400">/</span>
                    <span className="text-earth-brown-800 font-medium">{art.title}</span>
                </nav>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Section */}
                    <div className="relative aspect-square bg-beige-200 rounded-3xl overflow-hidden shadow-xl">
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
                            priority
                        />
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div>
                            <p className="text-sm font-semibold text-earth-brown-600 uppercase tracking-wider mb-2">
                                {art.category}
                            </p>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-earth-brown-900 mb-4">
                                {art.title}
                            </h1>
                            <p className="text-2xl font-bold text-earth-brown-800">
                                ₹{art.price.toLocaleString()}
                            </p>
                        </div>

                        {/* Description */}
                        {art.description && (
                            <div>
                                <h2 className="text-lg font-bold text-earth-brown-800 mb-2">Description</h2>
                                <p className="text-earth-brown-700 leading-relaxed">
                                    {art.description}
                                </p>
                            </div>
                        )}

                        {/* Specifications */}
                        <div className="bg-beige-100 rounded-2xl p-6 space-y-3">
                            <h2 className="text-lg font-bold text-earth-brown-800 mb-3">Specifications</h2>
                            {art.dimensions && (
                                <div className="flex justify-between">
                                    <span className="text-earth-brown-600 font-medium">Dimensions:</span>
                                    <span className="text-earth-brown-800">{art.dimensions}</span>
                                </div>
                            )}
                            {art.material && (
                                <div className="flex justify-between">
                                    <span className="text-earth-brown-600 font-medium">Material:</span>
                                    <span className="text-earth-brown-800">{art.material}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-earth-brown-600 font-medium">Category:</span>
                                <span className="text-earth-brown-800">{art.category}</span>
                            </div>
                        </div>

                        {/* Artist Info */}
                        <div className="bg-beige-100 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-earth-brown-800 mb-3">About the Artist</h2>
                            <p className="text-xl font-semibold text-earth-brown-900 mb-2">{art.artist.name}</p>
                            {art.artist.bio && (
                                <p className="text-earth-brown-700">{art.artist.bio}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="flex-1 bg-earth-brown-800 text-cream-50 py-4 rounded-full font-bold text-lg hover:bg-earth-brown-900 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                            >
                                {isAdding ? "Added!" : "Add to Cart"}
                            </button>
                            <button
                                onClick={handleAddToWishlist}
                                disabled={isWishAdding}
                                className="px-6 py-4 bg-beige-200 text-earth-brown-800 rounded-full font-bold hover:bg-beige-300 transition-all duration-300 shadow-md disabled:opacity-50"
                            >
                                {isWishAdding ? (
                                    <svg
                                        className="w-6 h-6 animate-bounce"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c2.54 0 4.04 1.54 4.5 2.09C12.46 4.54 13.96 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedArt.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-3xl font-extrabold text-earth-brown-800 mb-8">
                            Similar Artworks
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedArt.map((relatedItem) => (
                                <ProductCard
                                    key={relatedItem._id}
                                    id={relatedItem._id}
                                    title={relatedItem.title}
                                    artistName={relatedItem.artist?.name || "Anonymous"}
                                    price={relatedItem.price}
                                    image={relatedItem.imageUrl}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
