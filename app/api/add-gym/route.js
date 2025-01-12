import { NextResponse } from "next/server";
import Video from "@/models/Video";
import connectDB from "@/libs/db";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import cloudinary from '../../../libs/cloudinary';
import fetch from 'node-fetch';

export async function POST(req) {
    try {
        const { title, video } = await req.json();

        if (!video || !title) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Convert base64 to buffer
        const base64Data = video.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "gymze",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

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

            await connectDB();
            // Save to MongoDB
            const videoDoc = await Video.create({
                userId: userId,
                videoTitle: title,
                videoUrl: result.secure_url
            });

            // Trigger FastAPI after saving video to MongoDB
            try {
                // Send POST request to FastAPI
                const fastApiResponse = await fetch("https://gymze-backend-fast-api.onrender.com/process-video", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId,
                        videoUrl: result.secure_url
                    }),
                });

                const fastApiResult = await fastApiResponse.json();

                if (!fastApiResponse.ok) {
                    console.error("FastAPI error:", fastApiResult);
                    return NextResponse.json(
                        { error: "Failed to trigger FastAPI" },
                        { status: 500 }
                    );
                }
                console.log(fastApiResult?.message || 'FastAPI processing completed');
                // Return success response to client
                return NextResponse.json(
                    { success: true, video: videoDoc, fastApiResult },
                    { status: 201 }
                );

            } catch (fastApiError) {
                console.error("Error triggering FastAPI:", fastApiError);
                return NextResponse.json(
                    { error: "Failed to trigger FastAPI" },
                    { status: 500 }
                );
            }

        } catch (error) {
            console.error('MongoDB Upload error:', error);
            return NextResponse.json(
                { error: "Database error" },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: "Error uploading video" },
            { status: 500 }
        );
    }
}
