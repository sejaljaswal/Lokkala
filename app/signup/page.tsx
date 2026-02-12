"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
    const [role, setRole] = useState<"Artist" | "Buyer">("Buyer");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Signup Details:", { name, role, email, password });
        // Handle signup logic here
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Join Lokkala
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Create an account to start your journey
                    </p>
                </div>

                {/* Role Selector */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 text-center">
                        Which one are you?
                    </label>
                    <div className="flex p-1 bg-gray-100 rounded-lg">
                        <button
                            onClick={() => setRole("Buyer")}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${role === "Buyer"
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Buyer
                        </button>
                        <button
                            onClick={() => setRole("Artist")}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${role === "Artist"
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Artist
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-gray-500 mt-1 uppercase tracking-wider">
                        {role === "Artist" ? "Share your creativity with the world" : "Discover and collect unique artworks"}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">
                        <div>
                            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                id="full-name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Sign up as {role}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
