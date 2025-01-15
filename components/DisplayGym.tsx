'use client';

import { useState, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';

interface VideoTitle {
    _id: string;
    videoTitle: string;
    videoStatus:boolean;
}

export default function DisplayGym() {
    const [titles, setTitles] = useState<VideoTitle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [activeGym, setActiveGym] = useState<VideoTitle | null>(null);

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
            setLoading(false);
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
        toast.info('Editing video title...', {
        position: "top-right",
        autoClose: 2000
        });
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
                if (Array.isArray(titles)) {
                    setTitles(titles.map(title =>
                        title._id === id
                            ? { ...title, videoTitle: editedTitle }
                            : title
                    ));
                }
                toast.success('Video title updated successfully!', {
                    position: "top-right",
                    autoClose: 3000
                  });
                setEditingId(null);
            }
        } catch {
            toast.error('Failed to update video title', {
                position: "top-right",
                autoClose: 3000
              });
        }
    };

    const handleGymSwitch = async (videoId: string) => {
        try {
            const response = await fetch('/api/update-gym-data-status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videoId,
                    status: !titles.find(t => t._id === videoId)?.videoStatus
                }),
            });

            if (response.ok) {
                // Updates frontend state
                setTitles(titles.map(t => ({
                    ...t,
                    videoStatus: t._id === videoId ? !t.videoStatus : false
                })));
                // Updates active gym display
                const newActiveGym = titles.find(t => t._id === videoId) || null;
                setActiveGym(newActiveGym);
                toast.success(`Successfully switched to ${newActiveGym?.videoTitle}`, {
                    position: "top-right",
                    autoClose: 3000
                });
            } else {
                setError('Failed to update gym status');
                toast.error('Failed to update gym status', {
                    position: "top-right",
                    autoClose: 3000
                });
            }
        } catch (err) {
            console.error('Error updating gym status:', err);
            setError('Failed to update gym status');
            toast.error('Error updating gym status', {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-4 p-4">
            <ToastContainer />
            <h3> Active Gym : {activeGym?.videoTitle}</h3>
            {titles && Array.isArray(titles) && titles.length > 0 ? (
                titles.map((video) => (
                <div
                    key={video._id}
                    className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => startEditing(video)}
                                className="text-white-500 hover:text-blue-600"
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
                                    className="border rounded px-2 py-1 text-black"
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
                            <span className="text-white-700">{video.videoTitle}</span>
                        )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={video.videoStatus}
                            onChange={() => handleGymSwitch(video._id)}
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
             ))
            ) : (
                <div>No videos available</div>
            )}
        </div>
    );
}