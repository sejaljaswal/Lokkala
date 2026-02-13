/**
 * Upload an image file to Cloudinary
 * @param file - The image file to upload
 * @returns The secure URL of the uploaded image
 * @throws Error if upload fails
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
}

/**
 * Update user profile image
 * @param avatarUrl - The Cloudinary URL of the uploaded image
 * @returns Updated user data
 * @throws Error if update fails
 */
export async function updateProfileImage(avatarUrl: string) {
    const response = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: avatarUrl }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile image");
    }

    return response.json();
}

/**
 * Combined function to upload image and update user profile
 * @param file - The image file to upload
 * @returns Updated user data with new avatar URL
 */
export async function uploadAndUpdateProfileImage(file: File) {
    // Upload to Cloudinary
    const avatarUrl = await uploadImageToCloudinary(file);
    
    // Update user profile
    const result = await updateProfileImage(avatarUrl);
    
    return result;
}
