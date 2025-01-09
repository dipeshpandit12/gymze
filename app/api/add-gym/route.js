import { NextResponse } from "next/server";
import Video from "@/models/Video";
import connectDB from "@/libs/db";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import cloudinary from '../../../libs/cloudinary';

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
            const video = await Video.create({
                userId: userId,
                videoTitle: title,
                videoUrl: result.secure_url
            });

            return NextResponse.json(
                { success: true, video },
                { status: 201 }
            );

        } catch(error) {
            console.error('Mongodb Upload error:', error);
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