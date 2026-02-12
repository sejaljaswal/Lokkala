import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json();

        // 1. Basic Validation
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // 2. Ensure Database Connection
        await dbConnect();

        // 3. Check for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 422 }
            );
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 5. Create new User
        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role.toLowerCase(), // ensuring lowercase for enum consistency
        });

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Signup Error:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
