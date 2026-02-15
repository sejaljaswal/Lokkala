import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import { addToWishlist } from "@/lib/wishlist";
import { useToast } from "@/components/Toast";

interface ProductCardProps {
    id?: string;
    image: string;
    title: string;
    artistName: string;
    price: number;
}

const ProductCard = ({ id, image, title, artistName, price }: ProductCardProps) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isWishAdding, setIsWishAdding] = useState(false);
    const { showToast } = useToast();

    const handleAddToWishlist = () => {
        setIsWishAdding(true);
        addToWishlist({
            id: id || `${title}-${artistName}`.replace(/\s+/g, "-").toLowerCase(),
            title,
            artistName,
            price,
            image: image,
        });
        showToast(`${title} added to wishlist!`, "success");
        setTimeout(() => {
            setIsWishAdding(false);
        }, 1000);
    };

    const handleAddToCart = () => {
        setIsAdding(true);
        
        addToCart({
            id: id || `${title}-${artistName}`.replace(/\s+/g, "-").toLowerCase(),
            title,
            artistName,
            price,
            image: image,
        });

        showToast(`${title} added to cart!`, "success");
        // Show feedback animation
        setTimeout(() => {
            setIsAdding(false);
        }, 1000);
    };

    return (
        <Link 
            href={`/art/${id}`}
            className="block group relative bg-beige-100 rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-2 border-beige-200/50 hover:border-earth-brown-800/20 flex flex-col h-full transform hover:-rotate-1"
        >
            {/* Image Container */}
            <div className="relative aspect-4/5 overflow-hidden bg-beige-200 m-2 rounded-3xl">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                    }}
                    unoptimized={true}
                />
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-earth-brown-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="bg-cream-50 text-earth-brown-800 px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                        View Details
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col grow">
                <div className="mb-1">
                    <p className="text-xs font-semibold text-earth-brown-600 uppercase tracking-wider">
                        {artistName}
                    </p>
                </div>
                <h3 className="text-lg font-bold text-earth-brown-800 line-clamp-1 mb-2">
                    {title}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-extrabold text-earth-brown-900">
                        ₹{price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToWishlist();
                            }}
                            disabled={isWishAdding}
                            className="group/wishlist relative p-2 rounded-full bg-cream-50 text-earth-brown-600 hover:bg-earth-brown-800 hover:text-cream-50 transition-colors duration-300 border border-beige-200 disabled:opacity-50"
                            title="Add to Wishlist"
                        >
                            {isWishAdding ? (
                                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c2.54 0 4.04 1.54 4.5 2.09C12.46 4.54 13.96 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            )}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-earth-brown-900 text-cream-50 text-xs font-semibold rounded-lg opacity-0 group-hover/wishlist:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Add to Wishlist
                            </span>
                        </button>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart();
                            }}
                            disabled={isAdding}
                            className="group/cart relative p-2 rounded-full bg-cream-50 text-earth-brown-600 hover:bg-earth-brown-800 hover:text-cream-50 transition-colors duration-300 border border-beige-200 disabled:opacity-50"
                            title="Add to Cart"
                        >
                            {isAdding ? (
                                <svg
                                    className="w-5 h-5 animate-bounce"
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
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            )}
                            {/* Tooltip */}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-earth-brown-900 text-cream-50 text-xs font-semibold rounded-lg opacity-0 group-hover/cart:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Add to Cart
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
