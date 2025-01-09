"use client";

import { useState, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";

interface VideoTitle {
    _id: string;
    videoTitle: string;
}

export default function DisplayGym() {
    const [titles, setTitles] = useState<VideoTitle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [activeGym, setActiveGym] = useState<string>('');

    useEffect(() => {
        fetchTitles();
    }, []);

    const fetchTitles = async () => {
        try {
            const response = await fetch('/api/get-gym-data');
            const data = await response.json();

            if (response.ok) {
                setTitles(data);
            } else {
                setError(data.message || 'Failed to fetch titles');
            }
        } catch (err) {
            setError('Failed to fetch titles');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (video: VideoTitle) => {
        setEditingId(video._id);
        setEditedTitle(video.videoTitle);
    };

    const saveEdit = async (id: string) => {
        try {
            const response = await fetch('/api/get-gym-data', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videoId: id,
                    newTitle: editedTitle
                }),
            });

            if (response.ok) {
                // Update local state with new title
                setTitles(titles.map(title =>
                    title._id === id
                        ? { ...title, videoTitle: editedTitle }
                        : title
                ));
                setEditingId(null);
            } else {
                throw new Error('Failed to update title');
            }
        } catch (error) {
            console.error('Error updating title:', error);
        }
    };

    const handleGymSwitch = (title: string) => {
        setActiveGym(title);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-4 p-4">
            {titles.map((video) => (
                <div
                    key={video._id}
                    className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => startEditing(video)}
                                className="text-gray-600 hover:text-blue-600"
                            >
                                <AiOutlineEdit size={20} />
                            </button>
                        </div>
                        {editingId === video._id ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="border rounded px-2 py-1"
                                    autoFocus
                                />
                                <button
                                    onClick={() => saveEdit(video._id)}
                                    className="text-sm text-green-600 hover:text-green-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <span className="text-gray-700">{video.videoTitle}</span>
                        )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={activeGym === video.videoTitle}
                            onChange={() => handleGymSwitch(video.videoTitle)}
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
        </div>
    );
}