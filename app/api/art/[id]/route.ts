import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Art from "@/models/Art";
import jwt from "jsonwebtoken";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        const art = await Art.findById(id)
            .populate("artist", "name bio email")
            .lean();

        if (!art) {
            return NextResponse.json(
                { message: "Artwork not found" },
                { status: 404 }
            );
        }

        // Get related products (same category, excluding current)
        const relatedArt = await Art.find({
            category: art.category,
            _id: { $ne: id }
        })
            .populate("artist", "name")
            .limit(4)
            .lean();

        return NextResponse.json({ art, relatedArt }, { status: 200 });
    } catch (error) {
        console.error("Error fetching art:", error);
        return NextResponse.json(
            { message: "Error fetching artwork" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Check authentication
        const token = request.headers.get("cookie")
            ?.split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        // Verify JWT and check role
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
        
        if (decoded.role !== "artist") {
            return NextResponse.json(
                { message: "Unauthorized. Only artists can delete artwork." },
                { status: 403 }
            );
        }

        const { id } = await params;
        await dbConnect();

        // Find the artwork and verify ownership
        const art = await Art.findById(id);

        if (!art) {
            return NextResponse.json(
                { message: "Artwork not found" },
                { status: 404 }
            );
        }

        // Verify the artist owns this artwork
        if (art.artist.toString() !== decoded.id) {
            return NextResponse.json(
                { message: "Forbidden. You can only delete your own artwork." },
                { status: 403 }
            );
        }

        await Art.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Artwork deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting art:", error);
        return NextResponse.json(
            { message: "Error deleting artwork" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Check authentication
        const token = request.headers.get("cookie")
            ?.split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        // Verify JWT and check role
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
        
        if (decoded.role !== "artist") {
            return NextResponse.json(
                { message: "Unauthorized. Only artists can edit artwork." },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        await dbConnect();

        // Find the artwork and verify ownership
        const existingArt = await Art.findById(id);

        if (!existingArt) {
            return NextResponse.json(
                { message: "Artwork not found" },
                { status: 404 }
            );
        }

        // Verify the artist owns this artwork
        if (existingArt.artist.toString() !== decoded.id) {
            return NextResponse.json(
                { message: "Forbidden. You can only edit your own artwork." },
                { status: 403 }
            );
        }

        const art = await Art.findByIdAndUpdate(
            id,
            {
                title: body.title,
                description: body.description,
                price: body.price,
                category: body.category,
                dimensions: body.dimensions,
                material: body.material,
            },
            { returnDocument: 'after', runValidators: true }
        );

        if (!art) {
            return NextResponse.json(
                { message: "Artwork not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Artwork updated successfully", art },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating art:", error);
        return NextResponse.json(
            { message: "Error updating artwork" },
            { status: 500 }
        );
    }
}
