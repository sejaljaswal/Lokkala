"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/components/Toast";

export default function EditArtPage({ params }: { params: Promise<{ id: string }> }) {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Painting",
        dimensions: "",
        material: "",
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const router = useRouter();
    const [artId, setArtId] = useState<string>("");

    useEffect(() => {
        params.then((resolvedParams) => {
            setArtId(resolvedParams.id);
        });
    }, [params]);

    useEffect(() => {
        if (!artId) return;

        const fetchArt = async () => {
            try {
                const res = await fetch(`/api/art/${artId}`);
                const data = await res.json();

                if (res.ok && data.art) {
                    const art = data.art;
                    setFormData({
                        title: art.title || "",
                        description: art.description || "",
                        price: art.price?.toString() || "",
                        category: art.category || "Painting",
                        dimensions: art.dimensions || "",
                        material: art.material || "",
                    });
                    setImageUrl(art.imageUrl);
                } else {
                    showToast("Artwork not found", "error");
                    router.push("/profile");
                }
            } catch (error) {
                console.error("Error fetching art:", error);
                showToast("Error loading artwork", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchArt();
    }, [artId, router, showToast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch(`/api/art/${artId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                }),
            });

            if (res.ok) {
                showToast("Artwork updated successfully!", "success");
                router.push("/profile");
            } else {
                const data = await res.json();
                showToast(data.message || "Failed to update artwork", "error");
            }
        } catch (error) {
            console.error("Error updating art:", error);
            showToast("Error updating artwork", "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-cream-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-beige-100 rounded-3xl p-8 shadow-xl border-2 border-beige-200">
                        {/* Title Skeleton */}
                        <div className="h-9 bg-beige-200 rounded w-48 mb-8 animate-shimmer"></div>
                        
                        {/* Image Preview Skeleton */}
                        <div className="mb-6">
                            <div className="h-4 bg-beige-200 rounded w-32 mb-2 animate-shimmer"></div>
                            <div className="w-64 h-64 bg-beige-200 rounded-2xl animate-shimmer"></div>
                        </div>

                        {/* Form Fields Skeleton */}
                        <div className="space-y-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i}>
                                    <div className="h-4 bg-beige-200 rounded w-24 mb-2 animate-shimmer"></div>
                                    <div className="h-10 bg-beige-200 rounded w-full animate-shimmer"></div>
                                </div>
                            ))}
                        </div>

                        {/* Buttons Skeleton */}
                        <div className="flex gap-4 mt-8">
                            <div className="h-12 bg-beige-200 rounded-full w-32 animate-shimmer"></div>
                            <div className="h-12 bg-beige-200 rounded-full w-32 animate-shimmer"></div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-cream-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-beige-100 rounded-3xl p-8 shadow-xl border-2 border-beige-200">
                    <h1 className="text-3xl font-extrabold text-earth-brown-800 mb-8">Edit Artwork</h1>

                    {/* Current Image Preview */}
                    {imageUrl && (
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                Current Image
                            </label>
                            <div className="relative h-64 w-full bg-beige-200 rounded-xl overflow-hidden">
                                <Image
                                    src={imageUrl}
                                    alt={formData.title}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                    unoptimized={true}
                                />
                            </div>
                            <p className="text-sm text-earth-brown-600 mt-2 italic">
                                Note: Image cannot be changed after upload
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-beige-300 focus:border-earth-brown-600 focus:outline-none bg-cream-50"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border-2 border-beige-300 focus:border-earth-brown-600 focus:outline-none bg-cream-50"
                                placeholder="Describe your artwork..."
                            />
                        </div>

                        {/* Price and Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-300 focus:border-earth-brown-600 focus:outline-none bg-cream-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-300 focus:border-earth-brown-600 focus:outline-none bg-cream-50"
                                >
                                    <option value="Painting">Painting</option>
                                    <option value="Pottery">Pottery</option>
                                    <option value="Sculpture">Sculpture</option>
                                    <option value="Textile">Textile</option>
                                    <option value="Jewelry">Jewelry</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Dimensions and Material */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                    Dimensions
                                </label>
                                <input
                                    type="text"
                                    name="dimensions"
                                    value={formData.dimensions}
                                    onChange={handleChange}
                                    placeholder="e.g., 24x36 inches"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-300 focus:border-earth-brown-600 focus:outline-none bg-cream-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-earth-brown-700 mb-2">
                                    Material
                                </label>
                                <input
                                    type="text"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleChange}
                                    placeholder="e.g., Canvas, Oil Paint"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-beige-300 focus:border-earth-brown-600 focus:outline-none bg-cream-50"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-earth-brown-800 text-cream-50 py-4 rounded-full font-bold text-lg hover:bg-earth-brown-900 transition-all duration-300 shadow-lg disabled:opacity-50"
                            >
                                {submitting ? "Updating..." : "Update Artwork"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/profile")}
                                className="px-8 py-4 bg-beige-200 text-earth-brown-800 rounded-full font-bold hover:bg-beige-300 transition-all duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
