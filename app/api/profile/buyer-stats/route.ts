import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Purchase from "@/models/Purchase";

export async function GET() {
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

        // Connect to database
        await dbConnect();

        // Get buyer's purchases
        const purchases = await Purchase.find({ buyer: decoded.id, status: "completed" })
            .populate("art", "title imageUrl category")
            .populate("artist", "name")
            .sort({ createdAt: -1 })
            .lean();

        // Calculate total spent
        const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price, 0);

        return NextResponse.json(
            {
                purchases: purchases.map(purchase => ({
                    id: purchase._id,
                    artTitle: purchase.art?.title || "Unknown",
                    artImage: purchase.art?.imageUrl || "",
                    artCategory: purchase.art?.category || "",
                    artistName: purchase.artist?.name || "Unknown",
                    price: purchase.price,
                    purchasedAt: purchase.createdAt,
                })),
                totalSpent,
                purchaseCount: purchases.length,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Get buyer stats error:", error);
        return NextResponse.json(
            { message: "Error fetching buyer statistics" },
            { status: 500 }
        );
    }
}
