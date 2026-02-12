"use client";

import ProductCard from "@/components/ProductCard";

const products = [
    {
        id: 1,
        title: "Traditional Warli Canvas",
        artistName: "Ramesh Varma",
        price: 1200,
        image: "/art/warli.png",
    },
    {
        id: 2,
        title: "Handcrafted Terracotta Vase",
        artistName: "Sita Devi",
        price: 850,
        image: "/art/terracotta.png",
    },
    {
        id: 3,
        title: "Madhubani Tree of Life",
        artistName: "Gauri Shankar",
        price: 3500,
        image: "/art/madhubani.png",
    },
    {
        id: 4,
        title: "Dhokra Brass Musician",
        artistName: "Madan Lal",
        price: 2200,
        image: "/art/dhokra.png",
    },
    {
        id: 5,
        title: "Pattachitra Scroll Art",
        artistName: "Bibhu Dutta",
        price: 4500,
        image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 6,
        title: "Gond Forest Narrative",
        artistName: "Subhash Vyam",
        price: 2800,
        image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&auto=format&fit=crop",
    },
];

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-cream-50">
            {/* Header Section */}
            <div className="bg-beige-100 border-b border-beige-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <h1 className="text-4xl font-extrabold text-earth-brown-800 tracking-tight sm:text-5xl">
                        Tribal Treasures
                    </h1>
                    <p className="mt-4 text-xl text-earth-brown-600 max-w-2xl">
                        Explore our curated collection of authentic tribal art, handcrafted by master artisans from across India.
                    </p>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2 text-sm text-earth-brown-600">
                        <span>Showing</span>
                        <span className="font-bold text-earth-brown-800">{products.length}</span>
                        <span>masterpieces</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <select className="bg-beige-100 border border-beige-200 text-earth-brown-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-earth-brown-600 text-sm">
                            <option>Sort by: Featured</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest First</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            title={product.title}
                            artistName={product.artistName}
                            price={product.price}
                            image={product.image}
                        />
                    ))}
                </div>
            </div>

            {/* Newsletter/CTA Section */}
            <div className="bg-earth-brown-900 mt-20">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        <span className="block">Want to see more art?</span>
                        <span className="block text-beige-200">Join our newsletter for weekly updates.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-md shadow">
                            <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-cream-50 bg-earth-brown-700 hover:bg-earth-brown-800">
                                Get Started
                            </button>
                        </div>
                        <div className="ml-3 inline-flex rounded-md shadow">
                            <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-earth-brown-800 bg-beige-100 hover:bg-beige-200">
                                Learn more
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
