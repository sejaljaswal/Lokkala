import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ isAuthenticated: false }, { status: 200 });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return NextResponse.json({ isAuthenticated: false }, { status: 200 });
        }

        try {
            jwt.verify(token, JWT_SECRET);
            return NextResponse.json({ isAuthenticated: true }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ isAuthenticated: false }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }
}
