import { NextResponse } from "next/server";


export async function GET(){
    try{
        const response = NextResponse.json({message: "User logged out successfully"}, {status: 200})
        response.cookies.delete('token');
        return response;
    }catch(error){
        return NextResponse.json({message: "User logout failed",error: error.message}, {status: 500})
    }
}