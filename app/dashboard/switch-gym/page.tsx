'use client';

import { useState } from 'react';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';

export default function SwitchGym() {
    const [activeGym, setActiveGym] = useState('Gym 1');
    const gymLocations = [
        { id: 1, name: 'Gym 1' },
        { id: 2, name: 'Gym 2' },
        { id: 3, name: 'Gym 3' },
    ];

    const handleGymSwitch = (gymName: string) => {
        setActiveGym(gymName);
    };

    const handleUpload = (result: CloudinaryUploadWidgetResults) => {
        if (result.info) {
            // Handle successful upload
            console.log(result.info);
            // Add logic to update gym locations list
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="space-y-6">
                <h2 className="text-xl font-bold">Select Active Gym Location</h2>
                {gymLocations.map((gym) => (
                    <div 
                        key={gym.id}
                        className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
                    >
                        <span className="text-gray-700">{gym.name}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={activeGym === gym.name}
                                onChange={() => handleGymSwitch(gym.name)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                          peer-focus:ring-blue-300 rounded-full peer 
                                          peer-checked:after:translate-x-full peer-checked:after:border-white 
                                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                          after:bg-white after:border-gray-300 after:border after:rounded-full 
                                          after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                            </div>
                        </label>
                    </div>
                ))}

                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Add New Gym Location</h3>
                    <CldUploadWidget
                        uploadPreset="your-upload-preset"
                        onUpload={handleUpload}
                        options={{
                            resourceType: 'video',
                            sources: ['local', 'url'],
                            maxFiles: 1,
                            clientAllowedFormats: ['mp4', 'mov', 'avi', 'webm'],
                            maxFileSize: 104857600, // 100MB in bytes
                        }}
                    >
                        {({ open }) => (
                            <button
                                onClick={() => open()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                                         transition-colors duration-200"
                            >
                                Upload Video
                            </button>
                        )}
                    </CldUploadWidget>
                </div>
            </div>
        </div>
    );
}