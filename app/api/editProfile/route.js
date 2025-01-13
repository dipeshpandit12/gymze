import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/libs/db';
import UserProfile from '@/models/UserProfile';

export async function GET() {
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

    await connectDB();
    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return NextResponse.json({});
    }

    return NextResponse.json({
      fitnessGoal: profile.fitnessGoal,
      customGoal: profile.customGoal,
      age: profile.age,
      gender: profile.gender,
      fitnessLevel: profile.fitnessLevel,
      height: profile.height,
      weight: profile.weight,
      medicalConditions: profile.medicalConditions
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { message: 'Content-Type must be application/json' },
        { status: 415 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['fitnessGoal', 'customGoal', 'age', 'gender', 'height', 'weight'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await connectDB();

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        ...data,
        userId,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: {
        fitnessGoal: updatedProfile.fitnessGoal,
        customGoal: updatedProfile.customGoal,
        age: updatedProfile.age,
        gender: updatedProfile.gender,
        fitnessLevel: updatedProfile.fitnessLevel,
        height: updatedProfile.height,
        weight: updatedProfile.weight,
        medicalConditions: updatedProfile.medicalConditions
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}