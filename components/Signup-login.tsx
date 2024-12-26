"use client"
import Link from "next/link";

export default function SignupLogin(){
    return (
        <div className="flex gap-6">
            <Link
                href="/login"
                className="px-6 py-2 text-white border border-gray-700 rounded-full 
                hover:border-gray-500 transition-all duration-300 ease-in-out
                hover:bg-gray-900"
            >
                Login
            </Link>
            <Link
                href="/signup"
                className="px-6 py-2 bg-white text-black font-medium rounded-full 
                hover:bg-gray-100 transition-all duration-300 ease-in-out
                border border-transparent hover:border-gray-200"
            >
                Signup
            </Link>
        </div>
    );
}