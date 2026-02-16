import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Cart from "@/models/Cart";
import Art from "@/models/Art";

// GET - Get user's cart
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Please log in to view your cart" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        await dbConnect();

        let cart = await Cart.findOne({ userId: decoded.id }).populate({
            path: "items.artId",
            populate: { path: "artist", select: "name" },
        });

        if (!cart) {
            cart = await Cart.create({ userId: decoded.id, items: [] });
        }

        return NextResponse.json({ cart }, { status: 200 });
    } catch (error: any) {
        console.error("Get cart error:", error);
        return NextResponse.json(
            { message: "Error fetching cart" },
            { status: 500 }
        );
    }
}

// POST - Add item to cart
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Please log in to add items to cart" },
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

        let cart = await Cart.findOne({ userId: decoded.id });

        if (!cart) {
            cart = await Cart.create({
                userId: decoded.id,
                items: [{ artId, quantity: 1 }],
            });
        } else {
            const existingItem = cart.items.find(
                (item: any) => item.artId.toString() === artId
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({ artId, quantity: 1 });
            }

            await cart.save();
        }

        await cart.populate({
            path: "items.artId",
            populate: { path: "artist", select: "name" },
        });

        return NextResponse.json(
            { message: "Item added to cart", cart },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Add to cart error:", error);
        return NextResponse.json(
            { message: "Error adding to cart" },
            { status: 500 }
        );
    }
}

// DELETE - Clear cart
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

        await Cart.findOneAndUpdate(
            { userId: decoded.id },
            { items: [] },
            { new: true }
        );

        return NextResponse.json(
            { message: "Cart cleared" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Clear cart error:", error);
        return NextResponse.json(
            { message: "Error clearing cart" },
            { status: 500 }
        );
    }
}
