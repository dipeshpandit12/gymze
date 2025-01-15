'use client';
import { useState, useEffect, useCallback } from 'react';
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

        if (result.success) {
          try {
            const workoutPlan = typeof result.workoutPlan === 'string'
              ? JSON.parse(result.workoutPlan)
              : result.workoutPlan;
            return { success: true, data: workoutPlan };
          } catch {
            throw new Error('Invalid JSON format in workout plan');
          }
        } else {
          throw new Error(result.message || 'Failed to fetch workout plan');
        }
      } catch (err) {
        console.log(`Attempt ${i + 1} failed. Retrying...`);
        if (i === retries - 1) {
          throw err;
        }
        await delay(1000 * (i + 1)); // Exponential backoff
        continue;
      }
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchWithRetry(3);
      if (result?.success) {
        setData(result.data);
        setError(null);
      }
    } catch (err) {
      toast.error('Failed to load workout plan. Please try again later.');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!data && !error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-white">No workout plan available</h2>
        <p className="text-gray-300">Please add your gym location and create your profile first.</p>
      </div>
    );
  }

  return (
  <div className="p-4 max-w-4xl mx-auto">
    <ToastContainer position="top-right" autoClose={5000} />
    <h1 className="text-2xl font-bold mb-6 text-white">Your Weekly Workout Plan</h1>

    {error ? (
      <div className="bg-gray-900 border border-gray-700 text-white p-4 rounded-full">
        Error: {error}
      </div>
    ) : (
      <div className="grid gap-6">
        {data && Object.entries(data).map(([day, details]) => (
          <div key={day} className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 
            hover:border-gray-500 transition-all duration-300 ease-in-out">
            <h2 className="text-xl font-bold text-white">
              {day}: {details.Title}
            </h2>
            <div className="mt-2">
              <span className="inline-block bg-gray-800 text-white text-sm px-3 py-1 rounded-full 
                border border-gray-700">
                {details["Difficulty Label"]}
              </span>
            </div>
            <p className="my-3 text-gray-300">{details.Instruction}</p>
            <div className="mt-4">
              <h3 className="font-semibold text-white mb-2">Exercises:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {details.Exercises.map((exercise, index) => (
                  <li key={index} className="text-gray-300 hover:text-white 
                    transition-colors duration-300">{exercise}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}

