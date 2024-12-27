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
        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
    >
        Logout
    </button>
    )
}