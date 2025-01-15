'use client';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

interface WorkoutDetails {
  Title: string;
  "Difficulty Label": string;
  Instruction: string;
  Exercises: string[];
}

interface WorkoutPlan {
  [day: string]: WorkoutDetails;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function DashboardClient() {
  const [data, setData] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch("/api/dashboard");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch workout data');
        }

        if (result.workout) {
          setData(result.workout);
          setLoading(false);
          setError(null);
          toast.success('Workout plan loaded successfully!');
          return;
        } else {
          throw new Error('No workout data received');
        }

      } catch (err) {
        console.error(`Attempt ${i + 1} failed:`, err);

        if (i === retries - 1) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
          setLoading(false);
          setData(null);
          toast.error('Failed to load workout plan');
          return;
        }
        
        await delay(1000 * (i + 1));
      }
    }
  };

  useEffect(() => {
    fetchWithRetry();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
        <button 
          onClick={() => {
            setLoading(true);
            fetchWithRetry();
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
        <ToastContainer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-xl">No workout plan available</div>
        <ToastContainer />
      </div>
    );
  }

  return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Your Weekly Workout Plan</h1>
        <div className="grid gap-6">
          {Object.entries(data).map(([day, workout]) => (
            <div key={day} className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 
              hover:border-gray-500 transition-all duration-300 ease-in-out">
              <h2 className="text-xl font-bold text-white mb-2">{day}</h2>
              <h3 className="text-lg font-semibold text-gray-200">{workout.Title}</h3>
              <div className="inline-block px-2 py-1 my-2 text-sm rounded-full bg-gray-800 
                text-gray-200 border border-gray-700">
                {workout["Difficulty Label"]}
              </div>
              <p className="my-3 text-gray-300">{workout.Instruction}</p>
              <ul className="list-disc pl-5 space-y-1">
                {workout.Exercises.map((exercise, index) => (
                  <li key={index} className="text-gray-300 hover:text-white 
                    transition-colors duration-300">{exercise}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
  );
}