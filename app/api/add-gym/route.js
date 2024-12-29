import { NextResponse } from "next/server";
import Video from "@/models/Video";
import connectDB from "@/libs/db";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            );
        }

        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.userId;

        const { title, url } = await req.json();

        await connectDB();
        const existingUrl = await Video.findOne({ url });

        if (existingUrl) {
            return NextResponse.json(
                { message: "Gym already exists" },
                { status: 400 }
            );
        }

        // Create new gym  if doesn't exist
        const video = await Video.create({
            userId:userId,
            videoUrl:url,
            videoTitle:title,
        });
        console.log(video);
        return NextResponse.json(
            { message: "New GYM added successful" },
            { status: 201 }
        );
    } catch (error) {
        console.error("GYM add error:", error);
        return NextResponse.json(
            { message: error.message || "Error Adding new gym" },
            { status: 500 }
        );
    }
}