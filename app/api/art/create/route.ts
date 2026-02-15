import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Art from "@/models/Art";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
    try {
        const token = req.headers.get("cookie")
            ?.split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        // Verify JWT to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const artistId = decoded.id;

        // Use JSON for data
        const { title, description, price, category, imageUrl, dimensions, material } = await req.json();

        if (!title || !price || !category || !imageUrl) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await dbConnect();

        const newArt = await Art.create({
            title,
            description,
            price: Number(price),
            category,
            imageUrl,
            dimensions,
            material,
            artist: artistId,
        });

        return NextResponse.json(
            { message: "Artwork created successfully", art: newArt },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Art Creation Error:", error);
        return NextResponse.json(
            { message: "Failed to create artwork", error: error.message },
            { status: 500 }
        );
    }
}
