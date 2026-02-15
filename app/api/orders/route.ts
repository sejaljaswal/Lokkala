import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Purchase from "@/models/Purchase";

export async function GET() {
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

        await dbConnect();

        // Get all completed purchases for this buyer
        const purchases = await Purchase.find({ buyer: decoded.id, status: "completed" })
            .populate("art", "title imageUrl category price")
            .populate("artist", "name")
            .sort({ createdAt: -1 })
            .lean();

        // Split into active and past orders
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const activeOrders = purchases
            .filter((p: Record<string, unknown>) => p.shippingStatus !== "delivered")
            .map((p: Record<string, unknown>) => ({
                id: p._id,
                artTitle: (p.art as Record<string, unknown>)?.title || "Unknown",
                artImage: (p.art as Record<string, unknown>)?.imageUrl || "",
                artCategory: (p.art as Record<string, unknown>)?.category || "",
                artistName: (p.artist as Record<string, unknown>)?.name || "Unknown",
                price: p.price,
                shippingStatus: p.shippingStatus || "processing",
                estimatedDelivery: p.estimatedDelivery || new Date(new Date(p.createdAt as string).getTime() + 7 * 24 * 60 * 60 * 1000),
                purchasedAt: p.createdAt,
            }));

        const pastOrders = purchases
            .filter((p: Record<string, unknown>) => p.shippingStatus === "delivered")
            .map((p: Record<string, unknown>) => ({
                id: p._id,
                artTitle: (p.art as Record<string, unknown>)?.title || "Unknown",
                artImage: (p.art as Record<string, unknown>)?.imageUrl || "",
                artCategory: (p.art as Record<string, unknown>)?.category || "",
                artistName: (p.artist as Record<string, unknown>)?.name || "Unknown",
                price: p.price,
                shippingStatus: "delivered",
                deliveredAt: p.deliveredAt || p.updatedAt,
                purchasedAt: p.createdAt,
            }));

        return NextResponse.json(
            { activeOrders, pastOrders },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Get orders error:", error);
        return NextResponse.json(
            { message: "Error fetching orders" },
            { status: 500 }
        );
    }
}
