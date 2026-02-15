"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCart, clearCart, type CartItem } from "@/lib/cart";
import { useToast } from "@/components/Toast";

declare global {
    interface Window {
        Razorpay: new (options: {
            key: string;
            amount: number;
            currency: string;
            name: string;
            description: string;
            order_id: string;
            handler: (response: {
                razorpay_payment_id: string;
                razorpay_order_id: string;
                razorpay_signature: string;
            }) => void;
            prefill: {
                name: string;
                contact: string;
            };
            theme: {
                color: string;
            };
            modal: {
                ondismiss: () => void;
            };
        }) => {
            open: () => void;
        };
    }
}

export default function CheckoutPage() {
    const { showToast } = useToast();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const router = useRouter();

    // Address form state
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const items = getCart();
        if (items.length === 0) {
            router.push("/cart");
            return;
        }
        setCartItems(items);
        setLoading(false);

        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
            setRazorpayLoaded(true);
        };
        script.onerror = () => {
            console.error("Failed to load Razorpay script");
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [router]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Enter valid 10-digit phone number";
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter valid 6-digit pincode";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            if (paymentMethod === "online") {
                await handleOnlinePayment();
            } else {
                await handleCODPayment();
            }
        } catch (error) {
            console.error("Checkout error:", error);
            showToast(error instanceof Error ? error.message : "Failed to place order. Please try again.", "error");
            setSubmitting(false);
        }
    };

    const handleCODPayment = async () => {
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cartItems,
                    shippingAddress: formData,
                    paymentMethod: "cod",
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to place order");
            }

            // Clear cart and redirect
            clearCart();
            router.push("/orders?success=true");
        } finally {
            setSubmitting(false);
        }
    };

    const handleOnlinePayment = async () => {
        try {
            // Check if Razorpay script is loaded
            if (!window.Razorpay) {
                showToast("Payment system is loading. Please try again in a moment.", "warning");
                setSubmitting(false);
                return;
            }

            // Create Razorpay order
            const orderResponse = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }),
            });

            if (!orderResponse.ok) {
                throw new Error("Failed to create payment order");
            }

            const orderData = await orderResponse.json();

            // Initialize Razorpay
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "लोककला",
                description: "Art Purchase",
                order_id: orderData.orderId,
                handler: async function (response: {
                    razorpay_payment_id: string;
                    razorpay_order_id: string;
                    razorpay_signature: string;
                }) {
                    try {
                        // Verify payment
                        const verifyResponse = await fetch("/api/razorpay/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                items: cartItems,
                                shippingAddress: formData,
                            }),
                        });

                        if (!verifyResponse.ok) {
                            throw new Error("Payment verification failed");
                        }

                        // Clear cart and redirect
                        clearCart();
                        router.push("/orders?success=true");
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        showToast("Payment verification failed. Please contact support.", "error");
                    }
                },
                prefill: {
                    name: formData.fullName,
                    contact: formData.phone,
                },
                theme: {
                    color: "#5c4033",
                },
                modal: {
                    ondismiss: function() {
                        setSubmitting(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            setSubmitting(false);
            throw error;
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const shipping = 150;
    const total = subtotal + tax + shipping;

    if (loading) {
        return (
            <main className="min-h-screen bg-cream-50">
                {/* Header Skeleton */}
                <div className="bg-beige-100 border-b border-beige-200">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="h-10 bg-beige-200 rounded w-48 animate-shimmer"></div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Skeleton */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-beige-100 p-6 rounded-2xl border border-beige-200">
                                <div className="h-6 bg-beige-200 rounded w-40 mb-4 animate-shimmer"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[...Array(7)].map((_, i) => (
                                        <div key={i} className="h-10 bg-beige-200 rounded animate-shimmer"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary Skeleton */}
                        <div className="lg:col-span-1">
                            <div className="bg-beige-100 p-6 rounded-2xl border border-beige-200 sticky top-8">
                                <div className="h-6 bg-beige-200 rounded w-32 mb-4 animate-shimmer"></div>
                                <div className="space-y-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="flex justify-between">
                                            <div className="h-4 bg-beige-200 rounded w-20 animate-shimmer"></div>
                                            <div className="h-4 bg-beige-200 rounded w-16 animate-shimmer"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-cream-50">
            {/* Header */}
            <div className="bg-beige-100 border-b border-beige-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-extrabold text-earth-brown-800 tracking-tight">
                        Checkout
                    </h1>
                    <p className="mt-2 text-earth-brown-600">
                        Complete your order details
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-beige-100 rounded-3xl p-8 border-2 border-beige-200">
                                <h2 className="text-2xl font-extrabold text-earth-brown-800 mb-6 flex items-center gap-3">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Shipping Address
                                </h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${
                                                    errors.fullName ? "border-red-500" : "border-beige-300"
                                                } focus:border-earth-brown-600 focus:outline-none transition-colors bg-cream-50`}
                                                placeholder="Enter your full name"
                                            />
                                            {errors.fullName && (
                                                <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${
                                                    errors.phone ? "border-red-500" : "border-beige-300"
                                                } focus:border-earth-brown-600 focus:outline-none transition-colors bg-cream-50`}
                                                placeholder="10-digit mobile number"
                                                maxLength={10}
                                            />
                                            {errors.phone && (
                                                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                            Address Line 1 *
                                        </label>
                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={formData.addressLine1}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-xl border-2 ${
                                                errors.addressLine1 ? "border-red-500" : "border-beige-300"
                                            } focus:border-earth-brown-600 focus:outline-none transition-colors bg-cream-50`}
                                            placeholder="House no., Building name"
                                        />
                                        {errors.addressLine1 && (
                                            <p className="mt-1 text-xs text-red-600">{errors.addressLine1}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                            Address Line 2
                                        </label>
                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={formData.addressLine2}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-beige-300 focus:border-earth-brown-600 focus:outline-none transition-colors bg-cream-50"
                                            placeholder="Road name, Area, Colony (Optional)"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${
                                                    errors.city ? "border-red-500" : "border-beige-300"
                                                } focus:border-earth-brown-600 focus:outline-none transition-colors bg-cream-50`}
                                                placeholder="City"
                                            />
                                            {errors.city && (
                                                <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${
                                                    errors.state ? "border-red-500" : "border-beige-300"
                                                } focus:border-earth-brown-600 focus:outline-none transition-colors bg-cream-50`}
                                                placeholder="State"
                                            />
                                            {errors.state && (
                                                <p className="mt-1 text-xs text-red-600">{errors.state}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                                Pincode *
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${
                                                    errors.pincode ? "border-red-500" : "border-beige-300"
                                                } focus:border-earth-brown-600 focus:outline-none transition-colors bg-cream-50`}
                                                placeholder="6-digit PIN"
                                                maxLength={6}
                                            />
                                            {errors.pincode && (
                                                <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-beige-100 rounded-3xl p-8 border-2 border-beige-200">
                                <h2 className="text-2xl font-extrabold text-earth-brown-800 mb-6 flex items-center gap-3">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Payment Method
                                </h2>

                                <div className="space-y-3">
                                    {/* COD Option */}
                                    <label
                                        className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                                            paymentMethod === "cod"
                                                ? "border-earth-brown-600 bg-earth-brown-50"
                                                : "border-beige-300 bg-cream-50 hover:border-beige-400"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={(e) => setPaymentMethod(e.target.value as "cod")}
                                            className="w-5 h-5 text-earth-brown-600 focus:ring-earth-brown-600"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-6 h-6 text-earth-brown-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span className="font-bold text-earth-brown-800">Cash on Delivery</span>
                                            </div>
                                            <p className="text-sm text-earth-brown-600 mt-1">
                                                Pay with cash when your order is delivered
                                            </p>
                                        </div>
                                    </label>

                                    {/* Online Payment Option */}
                                    <label
                                        className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                                            paymentMethod === "online"
                                                ? "border-earth-brown-600 bg-earth-brown-50"
                                                : "border-beige-300 bg-cream-50 hover:border-beige-400"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === "online"}
                                            onChange={(e) => setPaymentMethod(e.target.value as "online")}
                                            className="w-5 h-5 text-earth-brown-600 focus:ring-earth-brown-600"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-6 h-6 text-earth-brown-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                                <span className="font-bold text-earth-brown-800">Online Payment</span>
                                            </div>
                                            <p className="text-sm text-earth-brown-600 mt-1">
                                                Pay securely using UPI, Cards, Net Banking
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-beige-100 rounded-3xl p-6 border-2 border-beige-200 sticky top-24">
                                <h2 className="text-xl font-extrabold text-earth-brown-800 mb-4">
                                    Order Summary
                                </h2>

                                {/* Cart Items */}
                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3 pb-3 border-b border-beige-200">
                                            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-beige-200">
                                                {item.image && (
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
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-earth-brown-800 text-sm truncate">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-earth-brown-600">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="text-sm font-bold text-earth-brown-800 mt-1">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-earth-brown-700">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-earth-brown-700">
                                        <span>Tax (10%)</span>
                                        <span className="font-semibold">₹{tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-earth-brown-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold">₹{shipping}</span>
                                    </div>
                                    <div className="pt-3 border-t-2 border-beige-300 flex justify-between">
                                        <span className="text-lg font-extrabold text-earth-brown-800">Total</span>
                                        <span className="text-lg font-extrabold text-earth-brown-800">
                                            ₹{total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={submitting || (paymentMethod === "online" && !razorpayLoaded)}
                                    className="w-full bg-earth-brown-800 text-cream-50 py-4 rounded-xl font-bold shadow-lg hover:bg-earth-brown-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream-50"></div>
                                            Processing...
                                        </>
                                    ) : paymentMethod === "online" && !razorpayLoaded ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream-50"></div>
                                            Loading Payment...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Place Order
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
