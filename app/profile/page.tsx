"use client";

import ProfileCard from "@/components/ProfileCard";

export default function ProfilePage() {
    const dummyUser = {
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
        name: "Elena Rivers",
        bio: "Contemporary tribal artist dedicated to preserving ancient storytelling through modern canvas work. Based in the heart of the artistic community, exploring the intersection of tradition and digital art.",
        role: "Artist" as const,
    };

    return (
        <main className="min-h-[calc(100vh-64px)] bg-cream-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-sm font-bold text-earth-brown-600 uppercase tracking-[0.2em] mb-2">Member Profile</h2>
                    <h1 className="text-4xl font-extrabold text-earth-brown-800">Account Overview</h1>
                </div>

                <ProfileCard
                    avatar={dummyUser.avatar}
                    name={dummyUser.name}
                    bio={dummyUser.bio}
                    role={dummyUser.role}
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
