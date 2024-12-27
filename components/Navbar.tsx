'use client';

import Link from "next/link";
import SignupLogin from "./Signup-login";
import { usePathname } from 'next/navigation';
import Profile from "./Profile";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
            <Link href="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
                Gymze
            </Link>

            <div className="flex gap-6">
                {pathname.startsWith('/dashboard') ? (
                    <Profile />
                ) : (
                    <SignupLogin />
                )}
            </div>
        </nav>
    )
}