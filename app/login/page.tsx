"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [role, setRole] = useState<"Artist" | "Buyer">("Buyer");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login Details:", { role, email, password });
        // Handle login logic here
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-cream-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-beige-100 p-8 rounded-2xl shadow-xl border border-beige-200">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-earth-brown-800">
                        Welcome back to Lokkala
                    </h2>
                    <p className="mt-2 text-center text-sm text-earth-brown-700">
                        Sign in to your account
                    </p>
                </div>

                {/* Role Selector */}
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

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">
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
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-beige-200 placeholder-earth-brown-400 text-earth-brown-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-brown-600 focus:border-earth-brown-600 sm:text-sm bg-cream-50/50"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-earth-brown-800 focus:ring-earth-brown-600 border-beige-200 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-earth-brown-800">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-earth-brown-800 hover:text-earth-brown-600">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-cream-50 bg-earth-brown-800 hover:bg-earth-brown-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earth-brown-600 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Sign in as {role}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-earth-brown-700">
                            Don't have an account?{" "}
                            <Link href="/signup" className="font-bold text-earth-brown-800 hover:text-earth-brown-600">
                                Join the community
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
