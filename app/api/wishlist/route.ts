import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import Art from "@/models/Art";

// GET - Get user's wishlist
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Please log in to view your wishlist" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        await dbConnect();

        let wishlist = await Wishlist.findOne({ userId: decoded.id }).populate({
            path: "items",
            populate: { path: "artist", select: "name" },
        });

        if (!wishlist) {
            wishlist = await Wishlist.create({ userId: decoded.id, items: [] });
        }

        return NextResponse.json({ wishlist }, { status: 200 });
    } catch (error: any) {
        console.error("Get wishlist error:", error);
        return NextResponse.json(
            { message: "Error fetching wishlist" },
            { status: 500 }
        );
    }
}

// POST - Add item to wishlist
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Please log in to add items to wishlist" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const { artId } = await req.json();

        if (!artId) {
            return NextResponse.json(
                { message: "Art ID is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Verify art exists
        const art = await Art.findById(artId);
        if (!art) {
            return NextResponse.json(
                { message: "Artwork not found" },
                { status: 404 }
            );
        }

        let wishlist = await Wishlist.findOne({ userId: decoded.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                userId: decoded.id,
                items: [artId],
            });
        } else {
            if (!wishlist.items.includes(artId)) {
                wishlist.items.push(artId);
                await wishlist.save();
            }
        }

        await wishlist.populate({
            path: "items",
            populate: { path: "artist", select: "name" },
        });

        return NextResponse.json(
            { message: "Item added to wishlist", wishlist },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Add to wishlist error:", error);
        return NextResponse.json(
            { message: "Error adding to wishlist" },
            { status: 500 }
        );
    }
}

// DELETE - Clear wishlist
export async function DELETE() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        await dbConnect();

        await Wishlist.findOneAndUpdate(
            { userId: decoded.id },
            { items: [] },
            { new: true }
        );

        return NextResponse.json(
            { message: "Wishlist cleared" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Clear wishlist error:", error);
        return NextResponse.json(
            { message: "Error clearing wishlist" },
            { status: 500 }
        );
    }
}
