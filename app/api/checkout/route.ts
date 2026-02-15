import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Purchase from "@/models/Purchase";
import Art from "@/models/Art";

interface CartItem {
    id: string;
    title: string;
    artistName: string;
    price: number;
    image: string;
    quantity: number;
}

interface ShippingAddress {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

        const body = await request.json();
        const { items, shippingAddress, paymentMethod } = body as {
            items: CartItem[];
            shippingAddress: ShippingAddress;
            paymentMethod: "cod" | "online";
        };

        if (!items || items.length === 0) {
            return NextResponse.json(
                { message: "Cart is empty" },
                { status: 400 }
            );
        }

        if (!shippingAddress || !shippingAddress.fullName) {
            return NextResponse.json(
                { message: "Shipping address is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Fetch art details for each item to get artistId
        const artIds = items.map(item => item.id);
        const arts = await Art.find({ _id: { $in: artIds } }).lean();

        if (arts.length !== artIds.length) {
            return NextResponse.json(
                { message: "Some items in your cart are no longer available" },
                { status: 400 }
            );
        }

        // Create a map for quick lookup
        const artMap = new Map(arts.map((art: { _id: { toString: () => string }; artist: string }) => [art._id.toString(), art]));

        // Create purchase records for each item
        const purchasePromises = items.flatMap((item) => {
            const art = artMap.get(item.id);
            if (!art) return [];

            // Create purchase record for each quantity
            return Array.from({ length: item.quantity }, () => 
                Purchase.create({
                    art: item.id,
                    buyer: decoded.id,
                    artist: art.artist,
                    price: item.price,
                    status: "completed",
                    shippingStatus: "processing",
                    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    shippingAddress: shippingAddress,
                    paymentMethod: paymentMethod,
                })
            );
        });

        await Promise.all(purchasePromises);

        return NextResponse.json(
            { 
                message: "Order placed successfully",
                success: true,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { message: "Error processing order" },
            { status: 500 }
        );
    }
}
