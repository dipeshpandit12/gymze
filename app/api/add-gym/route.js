import { NextResponse } from "next/server";
import Video from "@/models/Video";
import connectDB from "@/libs/db";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import cloudinary from '../../../libs/cloudinary';

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get('video');
        const title = data.get('title');

        if (!file || !title) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

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

        try{
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
                
        }catch(error){
            console.error('Mongodb Upload error:', error);
        }

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: "Error uploading video" },
            { status: 500 }
        );
    }
}