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
        const videoTitles = await Video.find({ userId, detected_items: { $exists: true, $ne: [] } }).select('videoTitle');

        if (!videoTitles || videoTitles.length === 0) {
            return NextResponse.json(
                { message: "No Gym location found" },
                { status: 200 }
            );
        }

        return NextResponse.json(videoTitles, { status: 200 });
    } catch (error) {
        console.error("Error fetching gym location:", error);
        return NextResponse.json(
            { message: error.message || "Error fetching gym location" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const { videoId, newTitle } = await req.json();

        await connectDB();
        const updatedVideo = await Video.findOneAndUpdate(
            { _id: videoId, userId }, // ensure user owns the video
            { videoTitle: newTitle },
            { new: true }
        );

        if (!updatedVideo) {
            return NextResponse.json(
                { message: "Video not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedVideo, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}