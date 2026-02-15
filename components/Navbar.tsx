"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCartCount } from "@/lib/cart";

interface Art {
    _id: string;
    title: string;
    artist?: { name: string };
    price: number;
    imageUrl: string;
    category?: string;
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Art[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/me", {
                    credentials: 'include',
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(true);
                    setUserRole(data.user.role);
                } else {
                    setIsAuthenticated(false);
                    setUserRole(null);
                }
            } catch {
                setIsAuthenticated(false);
                setUserRole(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Track cart count
    useEffect(() => {
        const updateCartCount = () => {
            setCartCount(getCartCount());
        };

        updateCartCount();

        // Listen for cart updates
        window.addEventListener("cartUpdated", updateCartCount);
        return () => window.removeEventListener("cartUpdated", updateCartCount);
    }, []);

    // Search functionality
    useEffect(() => {
        const searchArt = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                setShowSearchResults(false);
                return;
            }

            try {
                const res = await fetch("/api/art");
                const data = await res.json();
                
                if (res.ok) {
                    const filtered = data.filter((art: Art) => 
                        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        art.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        art.category?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).slice(0, 5); // Limit to 5 results
                    
                    setSearchResults(filtered);
                    setShowSearchResults(true);
                }
            } catch (error) {
                console.error("Search error:", error);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchArt();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.search-container')) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (response.ok) {
                setIsAuthenticated(false);
                setUserRole(null);
                router.push("/");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "Wishlist", href: "/wishlist" },
        ...(isAuthenticated
            ? [
                ...(userRole === "artist" ? [{ name: "Upload Art", href: "/upload" }] : []),
                { name: "Cart", href: "/cart" },
                { name: "Profile", href: "/profile" },
            ]
            : []),
    ];

    return (
        <nav className="bg-beige-100/90 backdrop-blur-md sticky top-0 z-50 border-b-2 border-beige-200 tribal-pattern">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-beige-100/50">
                <div className="flex justify-between h-20 items-center gap-4">
                    {/* Logo */}
                    <div className="shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-earth-brown-800 to-earth-brown-600 bg-clip-text text-transparent transition-transform hover:scale-105">
                            लोककला
                        </Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex relative flex-1 max-w-md search-container">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search art, artist, or category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                className="w-full px-4 py-2 pl-10 pr-4 rounded-full border-2 border-beige-300 focus:border-earth-brown-600 focus:outline-none bg-cream-50 text-earth-brown-800 placeholder-earth-brown-400"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-earth-brown-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>

                            {/* Search Results Dropdown */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border-2 border-beige-200 overflow-hidden max-h-96 overflow-y-auto z-50">
                                    {searchResults.map((art) => (
                                        <Link
                                            key={art._id}
                                            href={`/shop`}
                                            onClick={() => {
                                                setSearchQuery("");
                                                setShowSearchResults(false);
                                            }}
                                            className="flex items-center gap-3 p-3 hover:bg-beige-100 transition-colors border-b border-beige-200 last:border-b-0"
                                        >
                                            <div className="relative w-12 h-12 bg-beige-200 rounded-lg shrink-0 overflow-hidden">
                                                <Image
                                                    src={art.imageUrl}
                                                    alt={art.title}
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                    unoptimized={true}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-earth-brown-800 truncate">{art.title}</p>
                                                <p className="text-sm text-earth-brown-600 truncate">
                                                    by {art.artist?.name || "Anonymous"} • ₹{art.price?.toLocaleString()}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {showSearchResults && searchQuery.length >= 2 && searchResults.length === 0 && (
                                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border-2 border-beige-200 p-4 z-50">
                                    <p className="text-earth-brown-600 text-center">No results found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            link.name === "Cart" ? (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-earth-brown-800 hover:text-earth-brown-600 font-medium transition-colors duration-200 relative group flex items-center gap-1"
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
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    {link.name}
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount > 9 ? "9+" : cartCount}
                                        </span>
                                    )}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-earth-brown-600 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ) : link.name === "Wishlist" ? (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-earth-brown-800 hover:text-earth-brown-600 font-medium transition-colors duration-200 relative group flex items-center gap-1"
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
                                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c2.54 0 4.04 1.54 4.5 2.09C12.46 4.54 13.96 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                        />
                                    </svg>
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-earth-brown-600 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ) : (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-earth-brown-800 hover:text-earth-brown-600 font-medium transition-colors duration-200 relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-earth-brown-600 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            )
                        ))}
                        
                        {!loading && (
                            isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-cream-50 px-5 py-2 rounded-full font-medium hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-beige-200"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="bg-earth-brown-800 text-cream-50 px-5 py-2 rounded-full font-medium hover:bg-earth-brown-900 transition-all duration-300 shadow-md hover:shadow-beige-200"
                                >
                                    Login
                                </Link>
                            )
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-earth-brown-800 hover:text-earth-brown-600 hover:bg-beige-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-earth-brown-600 transition-all"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-beige-100 border-b border-beige-200 shadow-lg">
                    {/* Mobile Search Bar */}
                    <div className="px-3 py-2 search-container">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search art..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                className="w-full px-4 py-2 pl-10 pr-4 rounded-full border-2 border-beige-300 focus:border-earth-brown-600 focus:outline-none bg-cream-50 text-earth-brown-800 placeholder-earth-brown-400"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-earth-brown-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>

                            {/* Mobile Search Results */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border-2 border-beige-200 overflow-hidden max-h-64 overflow-y-auto z-50 left-0">
                                    {searchResults.map((art) => (
                                        <Link
                                            key={art._id}
                                            href={`/shop`}
                                            onClick={() => {
                                                setSearchQuery("");
                                                setShowSearchResults(false);
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center gap-3 p-3 hover:bg-beige-100 transition-colors border-b border-beige-200 last:border-b-0"
                                        >
                                            <div className="relative w-12 h-12 bg-beige-200 rounded-lg shrink-0 overflow-hidden">
                                                <Image
                                                    src={art.imageUrl}
                                                    alt={art.title}
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                    unoptimized={true}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-earth-brown-800 truncate text-sm">{art.title}</p>
                                                <p className="text-xs text-earth-brown-600 truncate">
                                                    by {art.artist?.name || "Anonymous"} • ₹{art.price?.toLocaleString()}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {navLinks.map((link) => (
                        link.name === "Cart" ? (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-all text-earth-brown-800 hover:text-earth-brown-600 hover:bg-beige-200 relative"
                                onClick={() => setIsOpen(false)}
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
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {link.name}
                                {cartCount > 0 && (
                                    <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                                        {cartCount > 9 ? "9+" : cartCount}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 rounded-md text-base font-medium transition-all text-earth-brown-800 hover:text-earth-brown-600 hover:bg-beige-200"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                    
                    {!loading && (
                        isAuthenticated ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="block w-full px-3 py-2 rounded-md text-base font-medium bg-red-600 text-cream-50 hover:bg-red-700 mt-4 text-center"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="block px-3 py-2 rounded-md text-base font-medium bg-earth-brown-800 text-cream-50 hover:bg-earth-brown-900 mt-4 text-center"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
