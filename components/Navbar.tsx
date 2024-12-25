import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center p-4 md:p-6 bg-[#0A0A0A] text-white">
            <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
                Gymze
            </Link>
            <div className="flex gap-4">
                <Link 
                    href="/login" 
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-[#1A1A1A]"
                >
                    Login
                </Link>
                <Link 
                    href="/signup" 
                    className="px-4 py-2 bg-white text-black font-medium rounded-full hover:opacity-90 transition-opacity"
                >
                    Sign up
                </Link>
            </div>
        </nav>
    )
}