import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <Link href="/">Gymze</Link>
            <div className="flex gap-4">
                <Link href="/login">Login</Link>
                <Link href="/signup">Signup</Link>
            </div>
        </nav>
    )
}