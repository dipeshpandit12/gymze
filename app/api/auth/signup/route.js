import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/libs/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Validate inputs
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectDB();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Create new user if doesn't exist
        const user = await User.create({
            email,
            password: await bcrypt.hash(password, 10)
        });
        console.log(user);
        return NextResponse.json(
            { message: "Signup successful" }, 
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: error.message || "Error creating user" },
            { status: 500 }
        );
    }
}