import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Cart from "@/models/Cart";

// PATCH - Update item quantity
export async function PATCH(
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
        const { quantity } = await req.json();

        if (quantity < 1) {
            return NextResponse.json(
                { message: "Quantity must be at least 1" },
                { status: 400 }
            );
        }

        await dbConnect();

        const cart = await Cart.findOne({ userId: decoded.id });

        if (!cart) {
            return NextResponse.json(
                { message: "Cart not found" },
                { status: 404 }
            );
        }

        const item = cart.items.find(
            (item: any) => item.artId.toString() === artId
        );

        if (!item) {
            return NextResponse.json(
                { message: "Item not found in cart" },
                { status: 404 }
            );
        }

        item.quantity = quantity;
        await cart.save();

        await cart.populate({
            path: "items.artId",
            populate: { path: "artist", select: "name" },
        });

        return NextResponse.json(
            { message: "Quantity updated", cart },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Update cart error:", error);
        return NextResponse.json(
            { message: "Error updating cart" },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from cart
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

        const cart = await Cart.findOne({ userId: decoded.id });

        if (!cart) {
            return NextResponse.json(
                { message: "Cart not found" },
                { status: 404 }
            );
        }

        cart.items = cart.items.filter(
            (item: any) => item.artId.toString() !== artId
        );

        await cart.save();

        await cart.populate({
            path: "items.artId",
            populate: { path: "artist", select: "name" },
        });

        return NextResponse.json(
            { message: "Item removed from cart", cart },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Remove from cart error:", error);
        return NextResponse.json(
            { message: "Error removing from cart" },
            { status: 500 }
        );
    }
}
