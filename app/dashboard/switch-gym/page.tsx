'use client';

import { useState } from 'react';
import { CldUploadWidget, CloudinaryUploadWidgetResults, CldVideoPlayer } from 'next-cloudinary';
import { AiOutlineEye, AiOutlineEdit } from 'react-icons/ai';

export default function SwitchGym() {
    const [activeGym, setActiveGym] = useState('Gym 1');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGymVideo, setSelectedGymVideo] = useState('');
    const [editingGymId, setEditingGymId] = useState<number | null>(null);
    const [editedName, setEditedName] = useState('');
    const [gymLocations, setGymLocations] = useState([
        { id: 1, name: 'Gym 1', videoUrl: 'video-public-id-1' },
        { id: 2, name: 'Gym 2', videoUrl: 'video-public-id-2' },
        { id: 3, name: 'Gym 3', videoUrl: 'video-public-id-3' },
    ]);

    const handleGymSwitch = (gymName: string) => {
        setActiveGym(gymName);
    };

    const handleUpload = (result: CloudinaryUploadWidgetResults) => {
        if (result.info) {
            console.log(result.info);
        }
    };

    const openVideoModal = (videoUrl: string) => {
        setSelectedGymVideo(videoUrl);
        setIsModalOpen(true);
    };

    const startEditing = (gym: { id: number; name: string }) => {
        setEditingGymId(gym.id);
        setEditedName(gym.name);
    };

    const saveEdit = (gymId: number) => {
        setGymLocations(gymLocations.map(gym =>
            gym.id === gymId ? { ...gym, name: editedName } : gym
        ));
        setEditingGymId(null);
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
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => openVideoModal(gym.videoUrl)}
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    <AiOutlineEye size={20} />
                                </button>
                                <button 
                                    onClick={() => startEditing(gym)}
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    <AiOutlineEdit size={20} />
                                </button>
                            </div>
                            {editingGymId === gym.id ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="border rounded px-2 py-1"
                                        autoFocus
                                    />
                                    <button 
                                        onClick={() => saveEdit(gym.id)}
                                        className="text-sm text-green-600 hover:text-green-700"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onClick={() => setEditingGymId(null)}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <span className="text-gray-700">{gym.name}</span>
                            )}
                        </div>
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

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-lg max-w-4xl w-full mx-4">
                            <div className="flex justify-end mb-2">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="aspect-video">
                                <CldVideoPlayer
                                    width="100%"
                                    height="100%"
                                    src={selectedGymVideo}
                                    colors={{ base: "#2563eb" }}
                                />
                            </div>
                        </div>
                    </div>
                )}

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
                            maxFileSize: 104857600,
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