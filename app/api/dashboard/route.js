import { NextResponse } from "next/server";
import Video from "@/models/Video";
import UserProfile from "@/models/UserProfile";
import connectDB from "@/libs/db";
import jwt from "jsonwebtoken";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

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
      detected_items: { $exists: true, $type: "array" },
    }).select("detected_items");

    if (!video) {
      return NextResponse.json(
        { message: "Add your gym location" },
        { status: 404 }
      );
    }

    const userProfile = await UserProfile.findOne({ userId }).select("-_id -__v");

    if (!userProfile) {
      return NextResponse.json(
        { message: "Complete your profile first" },
        { status: 404 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on:
    User Profile: ${JSON.stringify(userProfile)}
    Available Equipment: ${JSON.stringify(video)}

    Generate a structured workout plan for a week(7 days) with the use of only available gym equipment and analysing the User Profile data:
    1. Provide only 7 days workout routine in this format, strictly follow the pattern:
    {
      "Day 1": {
        "Title": "Chest and Triceps",
        "Difficulty Label": "Advanced",
        "Instruction": "Perform each exercise for 3 sets of 8-12 repetitions. Rest for 60-90 seconds between sets.",
        "Exercises": [
          "Barbell Bench Press",
          "Incline Dumbbell Press",
          "Dumbbell Flyes",
          "Triceps Pushdowns",
          "Skullcrushers"
        ]
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const workoutPlan = JSON.parse(jsonMatch[0]);

      return NextResponse.json(
        { 
          message: "Workout plan generated successfully",
          workout: workoutPlan 
        },
        { status: 200 }
      );
    } catch {
      return NextResponse.json(
        { message: "Failed to parse workout plan" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}