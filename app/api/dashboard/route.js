import { NextResponse } from "next/server";
import Video from "@/models/Video";
import connectDB from "@/libs/db";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore =await  cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        await connectDB();
        const video = await Video.findOne({
            userId,
            videoStatus: true,
            detected_items: { $exists: true, $type: "array" }
        }).select('detected_items');

        console.log(video);

        if (!video) {
            return NextResponse.json(
                { message: "No active video found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            equipment: video
        });
    } catch (error) {
        console.error("Error fetching gym location:", error);
        return NextResponse.json(
            { message: error.message || "Error fetching gym location" },
            { status: 500 }
        );
    }
}
