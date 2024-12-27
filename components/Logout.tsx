"use client"
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
        <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white font-medium rounded-full
            hover:bg-red-600 transition-all duration-300 ease-in-out
            border border-transparent hover:border-gray-200"
        >
            Logout
        </button>
    )
}