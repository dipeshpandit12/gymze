import { NextResponse } from "next/server";

export async function POST(req) {
    const { email, password } = await req.json();
    console.log(email, password);
    return NextResponse.json({ message: "Signup successful" });
}