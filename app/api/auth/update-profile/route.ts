import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req: Request) {
    try {
        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        // Verify token
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

        // Get update data from request
        const updates = await req.json();
        const { role, bio, avatar, name } = updates;

        // Connect to database
        await dbConnect();

        // Validate role if provided
        if (role && !["artist", "buyer"].includes(role.toLowerCase())) {
            return NextResponse.json(
                { message: "Invalid role. Must be 'artist' or 'buyer'" },
                { status: 400 }
            );
        }

        // Build update object
        const updateData: any = {};
        if (name) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (avatar) updateData.avatar = avatar;
        if (role) updateData.role = role.toLowerCase();

        // Update user
        const user = await User.findByIdAndUpdate(
            decoded.id,
            updateData,
            { returnDocument: 'after', runValidators: true }
        ).select("-password");

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Profile updated successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    bio: user.bio || "",
                    avatar: user.avatar,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Update profile error:", error);
        return NextResponse.json(
            { message: "Error updating profile" },
            { status: 500 }
        );
    }
}
