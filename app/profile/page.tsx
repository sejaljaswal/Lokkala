"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileListings from "@/components/profile/ProfileListings";
import SalesHistory from "@/components/profile/SalesHistory";
import PurchaseHistory from "@/components/profile/PurchaseHistory";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { uploadAndUpdateProfileImage } from "@/lib/uploadImage";
import type { UserData, ArtistStats, BuyerStats } from "@/types/profile";

export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [artistStats, setArtistStats] = useState<ArtistStats | null>(null);
    const [buyerStats, setBuyerStats] = useState<BuyerStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const fetchData = async () => {
        try {
            const userResponse = await fetch("/api/auth/me");
            
            if (!userResponse.ok) {
                router.push("/login");
                return;
            }

            const userData = await userResponse.json();
            setUser(userData.user);

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

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleImageUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const result = await uploadAndUpdateProfileImage(file);
            
            // Update user state with new avatar
            setUser((prevUser) => {
                if (!prevUser) return prevUser;
                return {
                    ...prevUser,
                    avatar: result.user.avatar,
                };
            });
        } catch (error: any) {
            console.error("Error uploading image:", error);
            alert(error.message || "Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleBioUpdate = async (newBio: string) => {
        const response = await fetch("/api/auth/update-profile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bio: newBio }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update bio");
        }

        const result = await response.json();
        
        // Update user state with new bio
        setUser((prevUser) => {
            if (!prevUser) return prevUser;
            return {
                ...prevUser,
                bio: result.user.bio,
            };
        });
    };

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-[calc(100vh-64px)] bg-cream-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-sm font-bold text-earth-brown-600 uppercase tracking-[0.2em] mb-2">
                        Member Profile
                    </h2>
                    <h1 className="text-4xl font-extrabold text-earth-brown-800">
                        Account Overview
                    </h1>
                </div>

                <ProfileHeader
                    avatar={user.avatar}
                    name={user.name}
                    bio={user.bio}
                    role={user.role}
                    onImageUpload={handleImageUpload}
                    onBioUpdate={handleBioUpdate}
                    isUploading={isUploading}
                />

                {/* Artist View */}
                {user.role === "artist" && artistStats && (
                    <div className="mt-12 space-y-8">
                        <ProfileStats
                            role="artist"
                            stats={{
                                listingsCount: artistStats.listingsCount,
                                salesCount: artistStats.salesCount,
                                totalSales: artistStats.totalSales,
                            }}
                        />

                        <ProfileListings listings={artistStats.listings} />

                        <SalesHistory sales={artistStats.sales} />
                    </div>
                )}

                {/* Buyer View */}
                {user.role === "buyer" && buyerStats && (
                    <div className="mt-12 space-y-8">
                        <ProfileStats
                            role="buyer"
                            stats={{
                                purchaseCount: buyerStats.purchaseCount,
                                totalSpent: buyerStats.totalSpent,
                            }}
                        />

                        <PurchaseHistory purchases={buyerStats.purchases} />
                    </div>
                )}
            </div>
        </main>
    );
}
