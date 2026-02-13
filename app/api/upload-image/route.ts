import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { message: "No file uploaded" },
                { status: 400 }
            );
        }

        // Convert to base64 Data URI
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64Image, {
            resource_type: "auto",
        });

        return NextResponse.json(
            {
                message: "Image uploaded successfully",
                secure_url: result.secure_url,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Upload Image Error:", error);
        return NextResponse.json(
            { message: "Failed to upload image", error: error.message },
            { status: 500 }
        );
    }
}
