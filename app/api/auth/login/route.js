import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/libs/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        await connectDB();

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found. Please check your email." },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Incorrect password. Please try again." },
                { status: 401 }
            );
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        const response= NextResponse.json({message: "User logged in successfully", token}, {status: 200})
        response.cookies.set('token', token, {httpOnly: true});
        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "An error occurred during login. Please try again." },
            { status: 500 }
        );
    }
}