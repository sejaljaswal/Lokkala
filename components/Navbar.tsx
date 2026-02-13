"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/status", {
                    credentials: 'include',
                });
                const data = await response.json();
                setIsAuthenticated(data.isAuthenticated);
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (response.ok) {
                setIsAuthenticated(false);
                router.push("/");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        ...(isAuthenticated
            ? [
                { name: "Upload Art", href: "/upload" },
                { name: "Profile", href: "/profile" },
            ]
            : []),
    ];

    return (
        <nav className="bg-beige-100/90 backdrop-blur-md sticky top-0 z-50 border-b-2 border-beige-200 tribal-pattern">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-beige-100/50">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-earth-brown-800 to-earth-brown-600 bg-clip-text text-transparent transition-transform hover:scale-105">
                            Lokkala
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-earth-brown-800 hover:text-earth-brown-600 font-medium transition-colors duration-200 relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-earth-brown-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
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
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block px-3 py-2 rounded-md text-base font-medium transition-all text-earth-brown-800 hover:text-earth-brown-600 hover:bg-beige-200"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    {!loading && (
                        isAuthenticated ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 text-cream-50 hover:bg-red-700 mt-4 text-center"
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
