"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderCardSkeleton } from "@/components/Skeleton";

interface Order {
    id: string;
    artTitle: string;
    artImage: string;
    artCategory: string;
    artistName: string;
    price: number;
    shippingStatus: string;
    estimatedDelivery?: string;
    deliveredAt?: string;
    purchasedAt: string;
}

export default function OrdersPage() {
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [pastOrders, setPastOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<"active" | "past">("active");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders");
                if (!res.ok) {
                    if (res.status === 401) {
                        router.push("/login");
                        return;
                    }
                    throw new Error("Failed to fetch orders");
                }
                const data = await res.json();
                setActiveOrders(data.activeOrders);
                setPastOrders(data.pastOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [router]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "processing":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        Processing
                    </span>
                );
            case "shipped":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Shipped
                    </span>
                );
            case "delivered":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Delivered
                    </span>
                );
            default:
                return null;
        }
    };

    const OrderCard = ({ order, type }: { order: Order; type: "active" | "past" }) => (
        <div className="bg-cream-50 rounded-2xl border-2 border-beige-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-44 h-44 sm:h-auto bg-beige-200 shrink-0">
                    {order.artImage ? (
                        <Image
                            src={order.artImage}
                            alt={order.artTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                            unoptimized={true}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-beige-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                                <h3 className="text-lg font-extrabold text-earth-brown-800 leading-tight">{order.artTitle}</h3>
                                <p className="text-sm text-earth-brown-600 mt-0.5">by {order.artistName}</p>
                            </div>
                            {getStatusBadge(order.shippingStatus)}
                        </div>
                        <p className="text-xs text-earth-brown-500 uppercase tracking-wider font-semibold">{order.artCategory}</p>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                        <div>
                            <p className="text-2xl font-extrabold text-earth-brown-800">₹{order.price.toLocaleString()}</p>
                            <p className="text-xs text-earth-brown-500 mt-1">
                                Ordered on {formatDate(order.purchasedAt)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {type === "active" ? (
                                <div className="flex items-center gap-2 bg-earth-brown-100 border border-earth-brown-200 px-4 py-2 rounded-xl">
                                    <svg className="w-5 h-5 text-earth-brown-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-bold text-earth-brown-800">
                                        Arriving on {formatDate(order.estimatedDelivery!)}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm font-bold text-green-800">
                                        Delivered on {formatDate(order.deliveredAt!)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-cream-50">
            {/* Header */}
            <div className="bg-beige-100 border-b border-beige-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-earth-brown-600 hover:text-earth-brown-800 font-medium transition-colors mb-6"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Profile
                    </Link>
                    <h1 className="text-4xl font-extrabold text-earth-brown-800 tracking-tight sm:text-5xl">
                        My Orders
                    </h1>
                    <p className="mt-4 text-xl text-earth-brown-600 max-w-2xl">
                        Track your art purchases and delivery status.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <OrderCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="flex gap-2 mb-8 bg-beige-100 p-1.5 rounded-2xl border border-beige-200 w-fit">
                            <button
                                onClick={() => setActiveTab("active")}
                                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                                    activeTab === "active"
                                        ? "bg-earth-brown-800 text-cream-50 shadow-lg"
                                        : "text-earth-brown-600 hover:text-earth-brown-800 hover:bg-beige-200"
                                }`}
                            >
                                Active Orders
                                {activeOrders.length > 0 && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                        activeTab === "active"
                                            ? "bg-cream-50/20 text-cream-50"
                                            : "bg-earth-brown-200 text-earth-brown-700"
                                    }`}>
                                        {activeOrders.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("past")}
                                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                                    activeTab === "past"
                                        ? "bg-earth-brown-800 text-cream-50 shadow-lg"
                                        : "text-earth-brown-600 hover:text-earth-brown-800 hover:bg-beige-200"
                                }`}
                            >
                                Past Orders
                                {pastOrders.length > 0 && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                        activeTab === "past"
                                            ? "bg-cream-50/20 text-cream-50"
                                            : "bg-earth-brown-200 text-earth-brown-700"
                                    }`}>
                                        {pastOrders.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Active Orders */}
                        {activeTab === "active" && (
                            <div>
                                {activeOrders.length === 0 ? (
                                    <div className="text-center py-20 bg-beige-100 rounded-3xl border-2 border-beige-200">
                                        <svg className="mx-auto h-20 w-20 text-beige-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <h3 className="text-2xl font-bold text-earth-brown-800">No active orders</h3>
                                        <p className="mt-2 text-earth-brown-600">All your orders have been delivered!</p>
                                        <Link
                                            href="/shop"
                                            className="mt-6 inline-block bg-earth-brown-800 text-cream-50 px-8 py-3 rounded-full font-semibold hover:bg-earth-brown-900 transition-all duration-300 shadow-lg"
                                        >
                                            Browse Shop
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {activeOrders.map((order) => (
                                            <OrderCard key={order.id} order={order} type="active" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Past Orders */}
                        {activeTab === "past" && (
                            <div>
                                {pastOrders.length === 0 ? (
                                    <div className="text-center py-20 bg-beige-100 rounded-3xl border-2 border-beige-200">
                                        <svg className="mx-auto h-20 w-20 text-beige-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <h3 className="text-2xl font-bold text-earth-brown-800">No past orders</h3>
                                        <p className="mt-2 text-earth-brown-600">Your delivered orders will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pastOrders.map((order) => (
                                            <OrderCard key={order.id} order={order} type="past" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
