"use client";

import ProfileCard from "@/components/ProfileCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: "artist" | "buyer";
    bio: string;
    avatar: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/me");
                
                if (!response.ok) {
                    // If not authenticated, redirect to login
                    router.push("/login");
                    return;
                }

                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-64px)] bg-cream-50 py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-pulse">
                        <div className="h-8 bg-beige-200 rounded w-48 mx-auto mb-4"></div>
                        <div className="h-12 bg-beige-200 rounded w-64 mx-auto"></div>
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

                {/* Decorative background visual */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-20 select-none grayscale">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-square bg-earth-brown-200 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        </main>
    );
}
