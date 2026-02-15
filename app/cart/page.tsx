"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCart, updateCartItemQuantity, removeFromCart, type CartItem } from "@/lib/cart";
import { CartItemSkeleton } from "@/components/Skeleton";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load cart from localStorage
    useEffect(() => {
        const loadCart = () => {
            const items = getCart();
            setCartItems(items);
            setIsLoading(false);
        };

        loadCart();

        // Listen for cart updates
        const handleCartUpdate = () => {
            loadCart();
        };

        window.addEventListener("cartUpdated", handleCartUpdate);
        return () => window.removeEventListener("cartUpdated", handleCartUpdate);
    }, []);

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        updateCartItemQuantity(id, newQuantity);
    };

    const removeItem = (id: string) => {
        removeFromCart(id);
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const tax = subtotal * 0.1; // 10% tax
    const shipping = cartItems.length > 0 ? 150 : 0;
    const total = subtotal + tax + shipping;

    return (
        <main className="min-h-screen bg-cream-50">
            {/* Header Section */}
            <div className="bg-beige-100 border-b border-beige-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <h1 className="text-4xl font-extrabold text-earth-brown-800 tracking-tight sm:text-5xl">
                        Your Cart
                    </h1>
                    <p className="mt-4 text-xl text-earth-brown-600 max-w-2xl">
                        Review your selected masterpieces before checkout.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {isLoading ? (
                    // Loading State
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <CartItemSkeleton key={i} />
                        ))}
                    </div>
                ) : cartItems.length === 0 ? (
                    // Empty Cart State
                    <div className="text-center py-20">
                        <svg
                            className="mx-auto h-24 w-24 text-beige-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        <h3 className="mt-6 text-2xl font-bold text-earth-brown-800">
                            Your cart is empty
                        </h3>
                        <p className="mt-2 text-earth-brown-600">
                            Start exploring our collection and add some masterpieces!
                        </p>
                        <div className="mt-8">
                            <Link
                                href="/shop"
                                className="inline-block bg-earth-brown-800 text-cream-50 px-8 py-3 rounded-full font-semibold hover:bg-earth-brown-900 transition-all duration-300 shadow-lg"
                            >
                                Browse Shop
                            </Link>
                        </div>
                    </div>
                ) : (
                    // Cart with Items
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-beige-100 rounded-3xl border-2 border-beige-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                                >
                                    <div className="flex flex-col sm:flex-row p-6 gap-6">
                                        {/* Product Image */}
                                        <div className="relative w-full sm:w-32 h-40 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-beige-200">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                                unoptimized={true}
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="grow space-y-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-earth-brown-800">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-earth-brown-600 mt-1">
                                                    by {item.artistName}
                                                </p>
                                            </div>
                                            <p className="text-2xl font-extrabold text-earth-brown-900">
                                                ₹{item.price.toLocaleString()}
                                            </p>

                                            {/* Quantity and Remove */}
                                            <div className="flex items-center gap-4 pt-4">
                                                <div className="flex items-center border-2 border-beige-300 rounded-full overflow-hidden">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-beige-200 hover:bg-beige-300 text-earth-brown-800 font-bold transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-6 py-2 font-bold text-earth-brown-800">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-beige-200 hover:bg-beige-300 text-earth-brown-800 font-bold transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-600 hover:text-red-800 font-semibold transition-colors flex items-center gap-2"
                                                >
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
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-beige-100 rounded-3xl border-2 border-beige-200 shadow-xl p-8 sticky top-24">
                                <h2 className="text-2xl font-bold text-earth-brown-800 mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-earth-brown-700">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">
                                            ₹{subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-earth-brown-700">
                                        <span>Tax (10%)</span>
                                        <span className="font-semibold">
                                            ₹{tax.toFixed(0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-earth-brown-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold">
                                            ₹{shipping}
                                        </span>
                                    </div>
                                    <div className="border-t-2 border-beige-300 pt-4 flex justify-between text-xl font-extrabold text-earth-brown-900">
                                        <span>Total</span>
                                        <span>₹{total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => router.push("/checkout")}
                                    className="w-full bg-earth-brown-800 text-cream-50 py-4 rounded-full font-bold text-lg hover:bg-earth-brown-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Proceed to Checkout
                                </button>

                                <Link
                                    href="/shop"
                                    className="block text-center mt-4 text-earth-brown-600 hover:text-earth-brown-800 font-semibold transition-colors"
                                >
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Trust Badges */}
            <div className="bg-beige-100 border-t border-beige-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-3">
                            <div className="w-16 h-16 bg-earth-brown-800 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-8 h-8 text-cream-50"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-bold text-earth-brown-800">
                                Secure Payment
                            </h3>
                            <p className="text-sm text-earth-brown-600">
                                Your payment information is encrypted and secure
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-16 h-16 bg-earth-brown-800 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-8 h-8 text-cream-50"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-bold text-earth-brown-800">
                                Authentic Art
                            </h3>
                            <p className="text-sm text-earth-brown-600">
                                Every piece is verified and handcrafted by skilled artisans
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-16 h-16 bg-earth-brown-800 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-8 h-8 text-cream-50"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-bold text-earth-brown-800">
                                Free Shipping
                            </h3>
                            <p className="text-sm text-earth-brown-600">
                                Free shipping on orders above ₹5000
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
