"use client";

import { useState } from "react";

export default function UploadArtPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Upload Data:", { title, description, price, image });
        // Handle the upload logic here (e.g., send to API)
        alert("Art submitted for review!");
    };

    return (
        <main className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-beige-100 rounded-2xl shadow-xl overflow-hidden border border-beige-200">
                    <div className="bg-earth-brown-800 px-8 py-10 text-cream-50">
                        <h1 className="text-3xl font-extrabold tracking-tight">Showcase Your Art</h1>
                        <p className="mt-2 text-beige-100">
                            Share your tribal masterpieces with our global community of collectors.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8 text-earth-brown-800">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Left Column: Form Fields */}
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-semibold mb-1">
                                        Product Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-beige-200 focus:ring-2 focus:ring-earth-brown-600 focus:border-earth-brown-600 transition-all outline-none bg-cream-50/50 text-earth-brown-900"
                                        placeholder="e.g. Traditional Warli Canvas"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-semibold mb-1">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-beige-200 focus:ring-2 focus:ring-earth-brown-600 focus:border-earth-brown-600 transition-all outline-none bg-cream-50/50 text-earth-brown-900"
                                        placeholder="2500"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-semibold mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-beige-200 focus:ring-2 focus:ring-earth-brown-600 focus:border-earth-brown-600 transition-all outline-none resize-none bg-cream-50/50 text-earth-brown-900"
                                        placeholder="Tell the story behind this piece..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Right Column: Image Upload */}
                            <div className="flex flex-col h-full">
                                <label className="block text-sm font-semibold mb-1">
                                    Product Image
                                </label>
                                <div
                                    className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-300 ${preview ? 'border-earth-brown-600 bg-beige-200/50' : 'border-beige-200 hover:border-earth-brown-400 bg-cream-50/30'
                                        }`}
                                >
                                    {preview ? (
                                        <div className="relative w-full h-full p-4">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => { setPreview(null); setImage(null); }}
                                                className="absolute top-6 right-6 p-2 bg-red-600 text-cream-50 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer text-center p-8">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-beige-200 text-earth-brown-800 mb-4">
                                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                            <span className="text-earth-brown-700 font-medium">Click to upload or drag and drop</span>
                                            <p className="text-xs text-earth-brown-400 mt-2">PNG, JPG up to 10MB</p>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-earth-brown-800 text-cream-50 py-4 px-8 rounded-xl font-bold text-lg hover:bg-earth-brown-900 transition-all shadow-lg hover:shadow-beige-200 transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Submit Artwork
                            </button>
                            <p className="text-center text-sm text-earth-brown-500 mt-4">
                                By submitting, you agree to Lokkala's artisan terms and conditions.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
