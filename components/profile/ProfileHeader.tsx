"use client";

import Image from "next/image";
import { useState, useRef } from "react";

interface ProfileHeaderProps {
    avatar: string;
    name: string;
    bio: string;
    role: "artist" | "buyer";
    onImageUpload: (file: File) => Promise<void>;
    onBioUpdate: (newBio: string) => Promise<void>;
    isUploading: boolean;
}

export default function ProfileHeader({
    avatar,
    name,
    bio,
    role,
    onImageUpload,
    onBioUpdate,
    isUploading,
}: ProfileHeaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageError, setImageError] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState(bio);
    const [isSavingBio, setIsSavingBio] = useState(false);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }

        await onImageUpload(file);
        
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleEditBio = () => {
        setBioText(bio);
        setIsEditingBio(true);
    };

    const handleCancelBio = () => {
        setBioText(bio);
        setIsEditingBio(false);
    };

    const handleSaveBio = async () => {
        if (bioText.trim() === bio) {
            setIsEditingBio(false);
            return;
        }

        setIsSavingBio(true);
        try {
            await onBioUpdate(bioText.trim());
            setIsEditingBio(false);
        } catch (error: any) {
            console.error("Error saving bio:", error);
            alert(error.message || "Failed to save bio. Please try again.");
            setBioText(bio);
        } finally {
            setIsSavingBio(false);
        }
    };

    return (
        <div className="bg-beige-100 rounded-[2.5rem] shadow-xl border-2 border-beige-200/50 overflow-hidden max-w-2xl mx-auto transform -rotate-1">
            {/* Cover Backdrop */}
            <div className="h-40 bg-gradient-to-br from-earth-brown-700 to-earth-brown-900 tribal-pattern"></div>

            <div className="px-8 pb-8">
                <div className="relative flex justify-between items-end -mt-16 mb-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="relative h-32 w-32 rounded-2xl overflow-hidden border-4 border-beige-100 shadow-lg bg-beige-100">
                            <Image
                                src={imageError ? "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=800&auto=format&fit=crop" : avatar}
                                alt={name}
                                fill
                                className="object-cover"
                                onError={() => setImageError(true)}
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>
                        
                        {/* Upload Button Overlay (on hover) */}
                        <button
                            onClick={handleImageClick}
                            disabled={isUploading}
                            className="absolute inset-0 bg-black/0 hover:bg-black/40 rounded-2xl transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed"
                        >
                            <span className="text-white font-bold text-sm">
                                {isUploading ? "Uploading..." : "Change Photo"}
                            </span>
                        </button>
                        
                        {/* Permanent Edit Icon */}
                        <button
                            onClick={handleImageClick}
                            disabled={isUploading}
                            className="absolute bottom-0 right-0 bg-earth-brown-800 hover:bg-earth-brown-900 text-white rounded-full p-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Change profile photo"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                                />
                            </svg>
                        </button>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* Role Badge */}
                    <div className="mb-2">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm ${
                            role === "artist"
                                ? "bg-earth-brown-800 text-cream-50"
                                : "bg-beige-200 text-earth-brown-800"
                        }`}>
                            {role}
                        </span>
                    </div>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-earth-brown-900 leading-tight">
                            {name}
                        </h1>
                        <p className="text-earth-brown-600 font-medium">
                            @{name.toLowerCase().replace(/\s+/g, "")}
                        </p>
                    </div>

                    <div className="bg-cream-50/50 rounded-2xl p-6 border border-beige-200">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-earth-brown-400 uppercase tracking-widest">
                                About
                            </h3>
                            {!isEditingBio && (
                                <button
                                    onClick={handleEditBio}
                                    className="text-xs text-earth-brown-600 hover:text-earth-brown-800 font-bold uppercase tracking-wide transition-colors"
                                >
                                    ✏️ Edit
                                </button>
                            )}
                        </div>
                        
                        {isEditingBio ? (
                            <div className="space-y-3">
                                <textarea
                                    value={bioText}
                                    onChange={(e) => setBioText(e.target.value)}
                                    placeholder="Share your story with the community..."
                                    maxLength={500}
                                    rows={4}
                                    className="w-full p-3 border border-beige-300 rounded-xl text-earth-brown-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-earth-brown-600"
                                    disabled={isSavingBio}
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-earth-brown-500">
                                        {bioText.length}/500 characters
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCancelBio}
                                            disabled={isSavingBio}
                                            className="px-4 py-2 text-sm font-bold text-earth-brown-700 bg-beige-200 rounded-lg hover:bg-beige-300 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveBio}
                                            disabled={isSavingBio}
                                            className="px-4 py-2 text-sm font-bold text-cream-50 bg-earth-brown-800 rounded-lg hover:bg-earth-brown-900 transition-colors disabled:opacity-50"
                                        >
                                            {isSavingBio ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-earth-brown-800 leading-relaxed text-lg italic">
                                "{bio || "No bio yet. Share your story with the community!"}"
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
