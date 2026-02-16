import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Wishlist from "@/models/Wishlist";

// DELETE - Remove item from wishlist
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ artId: string }> }
) {
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
        const { artId } = await params;

        await dbConnect();

        const wishlist = await Wishlist.findOne({ userId: decoded.id });

        if (!wishlist) {
            return NextResponse.json(
                { message: "Wishlist not found" },
                { status: 404 }
            );
        }

        wishlist.items = wishlist.items.filter(
            (item: any) => item.toString() !== artId
        );

        await wishlist.save();

        await wishlist.populate({
            path: "items",
            populate: { path: "artist", select: "name" },
        });

        return NextResponse.json(
            { message: "Item removed from wishlist", wishlist },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Remove from wishlist error:", error);
        return NextResponse.json(
            { message: "Error removing from wishlist" },
            { status: 500 }
        );
    }
}
