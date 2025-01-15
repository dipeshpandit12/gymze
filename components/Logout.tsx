'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';

export default function Logout() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if(response.ok){
                toast.success('Logging out successfully!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                toast.error('Failed to logout. Please try again.');
            }
        } catch {
            toast.error('An error occurred while logging out.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 disabled:opacity-50"
            >
                {isLoading ? 'Logging out...' : 'Logout'}
            </button>
        </>
    )
}