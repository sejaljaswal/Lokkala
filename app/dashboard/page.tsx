"use client";

import { useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import ProductCard from "@/components/ProductCard";

export default function DashboardPage() {
    const [userRole, setUserRole] = useState<"Artist" | "Buyer">("Artist");

    const artistData = {
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
        name: "Elena Rivers",
        bio: "Contemporary tribal artist dedicated to preserving ancient storytelling through modern canvas work.",
        listings: [
            { id: 1, title: "Midnight Serenity", artistName: "Elena Rivers", price: 1200, image: "/art/warli.png" },
            { id: 2, title: "Forest Echoes", artistName: "Elena Rivers", price: 850, image: "/art/terracotta.png" },
            { id: 3, title: "Tribal Dance", artistName: "Elena Rivers", price: 1500, image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&auto=format&fit=crop" },
        ],
    };

    const buyerData = {
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
        name: "Marcus Chen",
        bio: "Art collector and enthusiast of organic textures and tribal narratives.",
        orders: [
            { id: "ORD-101", date: "Feb 10, 2026", item: "handcrafted Terracotta Vase", price: 850, status: "Delivered" },
            { id: "ORD-102", date: "Jan 25, 2026", item: "Madhubani Tree of Life", price: 3500, status: "In Transit" },
        ],
    };

    const currentData = userRole === "Artist" ? artistData : buyerData;

    return (
        <main className="min-h-screen bg-cream-50 py-12 px-4">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Dashboard Header / Role Switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-earth-brown-800">User Dashboard</h1>
                        <p className="text-earth-brown-600 mt-1">Manage your {userRole === "Artist" ? "creations" : "collections"} and profile.</p>
                    </div>

                    <div className="flex p-1 bg-beige-200 rounded-xl w-fit">
                        <button
                            onClick={() => setUserRole("Artist")}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${userRole === "Artist" ? "bg-cream-50 text-earth-brown-800 shadow-sm" : "text-earth-brown-600 hover:text-earth-brown-800"
                                }`}
                        >
                            Artist View
                        </button>
                        <button
                            onClick={() => setUserRole("Buyer")}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${userRole === "Buyer" ? "bg-cream-50 text-earth-brown-800 shadow-sm" : "text-earth-brown-600 hover:text-earth-brown-800"
                                }`}
                        >
                            Buyer View
                        </button>
                    </div>
                </div>

                {/* Section 1: Profile */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
                    <div className="xl:col-span-1">
                        <ProfileCard
                            avatar={currentData.avatar}
                            name={currentData.name}
                            bio={currentData.bio}
                            role={userRole}
                        />
                    </div>

                    {/* Section 2: Conditional Content */}
                    <div className="xl:col-span-2 space-y-8">
                        {userRole === "Artist" ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-earth-brown-800">My Art Listings</h2>
                                    <button className="text-earth-brown-600 font-semibold hover:text-earth-brown-800 transition-colors">View All</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {artistData.listings.map((item) => (
                                        <ProductCard
                                            key={item.id}
                                            title={item.title}
                                            artistName={item.artistName}
                                            price={item.price}
                                            image={item.image}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-earth-brown-800">Order History</h2>
                                <div className="bg-beige-100 rounded-3xl border border-beige-200 shadow-xl overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-beige-200 border-b border-beige-200">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold text-earth-brown-500 uppercase tracking-widest">Order ID</th>
                                                <th className="px-6 py-4 text-xs font-bold text-earth-brown-500 uppercase tracking-widest">Date</th>
                                                <th className="px-6 py-4 text-xs font-bold text-earth-brown-500 uppercase tracking-widest">Item</th>
                                                <th className="px-6 py-4 text-xs font-bold text-earth-brown-500 uppercase tracking-widest text-right">Price</th>
                                                <th className="px-6 py-4 text-xs font-bold text-earth-brown-500 uppercase tracking-widest text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-beige-200">
                                            {buyerData.orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-cream-50/50 transition-colors">
                                                    <td className="px-6 py-5 font-medium text-earth-brown-900">{order.id}</td>
                                                    <td className="px-6 py-5 text-earth-brown-600">{order.date}</td>
                                                    <td className="px-6 py-5 text-earth-brown-800 font-semibold">{order.item}</td>
                                                    <td className="px-6 py-5 text-right font-extrabold text-earth-brown-900">${order.price}</td>
                                                    <td className="px-6 py-5">
                                                        <span className={`block w-fit mx-auto px-3 py-1 rounded-full text-xs font-bold ${order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
