"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [role, setRole] = useState<"Artist" | "Buyer">("Buyer");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: role.toLowerCase(),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // User is now automatically logged in via cookie
                router.push("/");
                window.location.href = "/"; // Force full page reload to update navbar
            } else {
                alert(data.message || "Something went wrong during signup");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-cream-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-beige-100 p-8 rounded-2xl shadow-xl border border-beige-200">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-earth-brown-800">
                        Join Lokkala
                    </h2>
                    <p className="mt-2 text-center text-sm text-earth-brown-700">
                        Create an account to start your journey
                    </p>
                </div>

                {/* Role Selector */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-earth-brown-800 text-center">
                        Which one are you?
                    </label>
                    <div className="flex p-1 bg-beige-200 rounded-lg">
                        <button
                            onClick={() => setRole("Buyer")}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${role === "Buyer"
                                ? "bg-cream-50 text-earth-brown-800 shadow-sm"
                                : "text-earth-brown-600 hover:text-earth-brown-800"
                                }`}
                        >
                            Buyer
                        </button>
                        <button
                            onClick={() => setRole("Artist")}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${role === "Artist"
                                ? "bg-cream-50 text-earth-brown-800 shadow-sm"
                                : "text-earth-brown-600 hover:text-earth-brown-800"
                                }`}
                        >
                            Artist
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-earth-brown-500 mt-1 uppercase tracking-wider">
                        {role === "Artist" ? "Share your creativity with the world" : "Discover and collect unique artworks"}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">
                        <div>
                            <label htmlFor="full-name" className="block text-sm font-medium text-earth-brown-800 mb-1">
                                Full Name
                            </label>
                            <input
                                id="full-name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-beige-200 placeholder-earth-brown-400 text-earth-brown-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-brown-600 focus:border-earth-brown-600 sm:text-sm bg-cream-50/50"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-earth-brown-800 mb-1">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-beige-200 placeholder-earth-brown-400 text-earth-brown-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-brown-600 focus:border-earth-brown-600 sm:text-sm bg-cream-50/50"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-earth-brown-800 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-beige-200 placeholder-earth-brown-400 text-earth-brown-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-brown-600 focus:border-earth-brown-600 sm:text-sm bg-cream-50/50"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-cream-50 bg-earth-brown-800 hover:bg-earth-brown-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earth-brown-600 transition-all duration-200 transform hover:scale-[1.02] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "Processing..." : `Sign up as ${role}`}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-earth-brown-700">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-earth-brown-800 hover:text-earth-brown-600">
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
