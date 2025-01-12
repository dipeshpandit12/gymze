import { NextResponse } from "next/server";
import Video from "@/models/Video";
import connectDB from "@/libs/db";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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

        const { videoId, status } = await req.json();

        await connectDB();

        // First, set all videos' status to false
        await Video.updateMany(
            { userId },
            { videoStatus: false }
        );

        // Then, update the selected video's status
        const updatedVideo = await Video.findOneAndUpdate(
            { _id: videoId, userId },
            { videoStatus: status },
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