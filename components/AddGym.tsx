"use client"

import {useState} from "react";

export default function UploadVideo() {
  const [title,setTitle] = useState("");
  const [url,setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!title || !url) {
        setError('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch("/api/add-gym", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
            },
            body: JSON.stringify({ title, url }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            // Reset form
            setTitle('');
            setUrl('');
        } else {
            setError("Failed to add gym");
        }
    } catch (error) {
      setError(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Fetch Error:', error);
    }
}


  return (
    <>
    <form className="space-y-6" onSubmit={handleSubmit}>
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
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
      <label className="block text-sm font-medium text-gray-700">
        URL of the video
      </label>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        type="url"
        className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm 
        bg-black text-white placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      {error && <p className="text-red-500">{error}</p>}
      </>
  )
}