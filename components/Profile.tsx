'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import Logout from './Logout';

export default function Profile() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSwitchGym = () => {
        router.push('/dashboard/switch-gym');
        setIsMenuOpen(false);
    };
    const handleEditProfile = () => {
        router.push('/dashboard/editProfile');
        setIsMenuOpen(false);
    };

    return (
        <div >
            <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                    <FaUserCircle className="text-2xl text-gray-600" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center 
                                   bg-green-500 text-white text-xs rounded-full">
                        1
                    </span>
                </button>

                {isMenuOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 
                                      overflow-hidden mx-4">
                            <div className="py-2">
                                <button
                                    onClick={handleSwitchGym}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Switch Gym
                                </button>
                                <button
                                    disabled
                                    className="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                                >
                                    Settings
                                </button>
                                <button
                                    onClick={handleEditProfile}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Edit Profile
                                </button>
                                <Logout />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}