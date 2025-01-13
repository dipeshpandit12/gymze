"use client";

import { useState } from "react";
import { toast } from 'react-toastify';

export default function UploadVideo() {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      setVideo(file);
      toast.info('Video file selected', {
        position: "top-right",
        autoClose: 2000
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    if (!title || !video) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000
      });
      return;
    };

    // Convert video to base64
    const reader = new FileReader();
    reader.readAsDataURL(video);
    reader.onload = async () => {
      toast.info('Processing video...', {
        position: "top-right",
        autoClose: 2000
      });

    reader.onerror = () => {
      toast.error('Error processing video file', {
        position: "top-right",
        autoClose: 3000
      });
    }
    const base64Video = reader.result;

      try {
        const response = await fetch("/api/add-gym", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            video: base64Video
          }),
        });

        if (response.ok) {
          setTitle("");
          setVideo(null);
          toast.success('Video uploaded successfully!', {
            position: "top-right",
            autoClose: 3000
          });
        } else {
          const data = await response.json();
          setError(`Upload failed: ${data.details || "Unknown error"}`);
        }
      } catch (error) {
        setError(
          `Upload failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    };
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white-700">
            Name of the Gym
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm 
        bg-black text-white placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white-700">
            Upload video
          </label>
          <input
            accept="video/*"
            onChange={handleFileChange}
            type="file"
            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm
        bg-black text-white placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
      {error && toast.error(error, {position: "top-right", autoClose: 3000 })}
    </>
  );
}
