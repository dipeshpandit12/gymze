import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/libs/db';
import UserProfile from '@/models/UserProfile';
import jwt from "jsonwebtoken"

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
    const data = await request.json();
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

    let userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      userProfile = await UserProfile.create({
        ...data,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {

      userProfile = await UserProfile.findOneAndUpdate(
        { userId },
        {
          ...data,
          updatedAt: new Date()
        },
        { new: true }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: userProfile
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}