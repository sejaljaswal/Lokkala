import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Art from "@/models/Art";

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
        const { id } = await params;
        await dbConnect();

        const art = await Art.findByIdAndDelete(id);

        if (!art) {
            return NextResponse.json(
                { message: "Artwork not found" },
                { status: 404 }
            );
        }

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
        const { id } = await params;
        const body = await request.json();
        await dbConnect();

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
            { new: true, runValidators: true }
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
