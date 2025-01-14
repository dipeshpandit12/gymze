import { NextResponse } from "next/server";
import Video from "@/models/Video";
import UserProfile from "@/models/UserProfile";
import connectDB from "@/libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

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

    // console.log(video);

    if (!video) {
      return NextResponse.json(
        { message: "Add your gym location" },
        { status: 404 }
      );
    }
    const userProfile = await UserProfile.findOne({ userId }).select(
      "-_id -__v"
    );
    if (!userProfile) {
      return NextResponse.json(
        { message: "Profile is not created" },
        { status: 404 }
      );
    }
    // console.log(userProfile);

    if (video && userProfile) {
      try {
        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Context for the AI with specific JSON format request
        const prompt = `Based on:
User Profile: ${JSON.stringify(userProfile)}
Available Equipment: ${JSON.stringify(video)}

Generate a structured workout plan for a week(7 days) with the use of only available gym equipment and analysing the User Profile data:
1. Provide only 7 days workout routine in this format, strickly follow the pattern:

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
    },
    "Day 2": {
        .......
    },
.......

}`;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // console.log(text);
        return NextResponse.json({
            success: true,
            workoutPlan:text});
      } catch  {
        // console.error("Error generating workout plan:", error);
        return NextResponse.json(
          { message: "Error generating workout plan" },
          { status: 500 }
        );
      }
    }
    return NextResponse.json({
      success: true,
      equipment: video,
      workoutPlan: "Either detected items or Userprofile not found",
    });
  } catch (error) {
    // console.error("Error fetching gym location:", error);
    return NextResponse.json(
      { message: error.message || "Error fetching gym location" },
      { status: 500 }
    );
  }
}
