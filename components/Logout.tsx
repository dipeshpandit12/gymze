"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Logout() {
    const router = useRouter();
    const handleLogout = async () => {
        const response = await fetch('/api/auth/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(response.ok){
            router.push('/login');
        }
    }
    return (
        <Link
                href="/logout"
                className="px-6 py-2 bg-red-500 text-white font-medium rounded-full 
                hover:bg-red-600 transition-all duration-300 ease-in-out
                border border-transparent hover:border-gray-200"
            >
                <button onClick={handleLogout}>Logout</button>
            </Link>
    )
}