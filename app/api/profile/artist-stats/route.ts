import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Art from "@/models/Art";
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

        // Get artist's art listings
        const listings = await Art.find({ artist: decoded.id })
            .sort({ createdAt: -1 })
            .lean();

        // Get artist's sales (purchases of their art)
        const sales = await Purchase.find({ artist: decoded.id, status: "completed" })
            .populate("art", "title imageUrl")
            .populate("buyer", "name")
            .sort({ createdAt: -1 })
            .lean();

        // Calculate total sales amount
        const totalSales = sales.reduce((sum, sale) => sum + sale.price, 0);

        return NextResponse.json(
            {
                listings: listings.map(art => ({
                    id: art._id,
                    title: art.title,
                    price: art.price,
                    imageUrl: art.imageUrl,
                    category: art.category,
                    createdAt: art.createdAt,
                })),
                sales: sales.map(sale => ({
                    id: sale._id,
                    artTitle: sale.art?.title || "Unknown",
                    artImage: sale.art?.imageUrl || "",
                    buyerName: sale.buyer?.name || "Unknown",
                    price: sale.price,
                    purchasedAt: sale.createdAt,
                })),
                totalSales,
                listingsCount: listings.length,
                salesCount: sales.length,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Get artist stats error:", error);
        return NextResponse.json(
            { message: "Error fetching artist statistics" },
            { status: 500 }
        );
    }
}
