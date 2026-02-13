import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Art from "@/models/Art";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();

        // Ensure User model is registered
        const _ = User;

        // Fetch all artworks
        const artworks = await Art.find({})
            .sort({ createdAt: -1 })
            .populate({ path: "artist", model: User, select: "name" });

        return NextResponse.json(artworks, { status: 200 });
    } catch (error: any) {
        console.error("Fetch Art Error:", error);
        return NextResponse.json(
            { message: "Failed to fetch artworks", error: error.message },
            { status: 500 }
        );
    }
}
