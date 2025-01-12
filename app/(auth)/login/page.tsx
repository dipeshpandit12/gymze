"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const loadingToast = toast.loading("Logging in...");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                toast.update(loadingToast, {
                    render: "Login successful!",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            } else {
                toast.update(loadingToast, {
                    render: "Login failed",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000
                });
            }
        } catch {
            toast.update(loadingToast, {
                render: "Login failed",
                type: "error",
                isLoading: false,
                autoClose: 2000
            });
        }
    }

    return (
        <div className="h-[calc(100vh-64px)] bg-[#0A0A0A] text-white overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col justify-center items-center h-full max-w-md">
            <ToastContainer position="top-right" />
                {/* Header */}
                <ToastContainer
                    position="top-right"
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
                <div className="text-center mb-8 w-full">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                        Welcome back
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg">
                        Login to continue your fitness journey
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm text-gray-300">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333]
                                     text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                                     transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm text-gray-300">
                            Password
                        </label>
                        <input 
                            id="password"
                            type="password" 
                            placeholder="Enter your password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                                     text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                                     transition-colors" 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-white text-black font-medium p-3 rounded-full
                                 hover:opacity-90 transition-opacity"
                    >
                        Login
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/signup" 
                                className="text-white hover:text-blue-400 transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}