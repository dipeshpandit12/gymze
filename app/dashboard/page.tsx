"use client";
import { useState, useEffect } from 'react';

interface WorkoutDetails {
  Title: string;
  "Difficulty Label": string;
  Instruction: string;
  Exercises: string[];
}

interface WorkoutPlan {
  [day: string]: WorkoutDetails;
}

export default function Dashboard() {
  const [data, setData] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const result = await response.json();
      if (result.success) {
        // Parse the string if it's not already an object
        const workoutPlan = typeof result.workoutPlan === 'string'
          ? JSON.parse(result.workoutPlan)
          : result.workoutPlan;
        setData(workoutPlan);
      } else {
        console.error("Failed to fetch workout plan");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No workout plan available</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Weekly Workout Plan</h1>
      {Object.entries(data).map(([day, details]) => (
        <div key={day} className="mb-6 p-4 border rounded-lg">
          <h2 className="text-xl font-bold">{day}: {details.Title}</h2>
          <p className="text-sm text-gray-600">Difficulty: {details["Difficulty Label"]}</p>
          <p className="my-2">{details.Instruction}</p>
          <div className="ml-4">
            <h3 className="font-semibold mb-2">Exercises:</h3>
            <ul className="list-disc pl-4">
              {details.Exercises.map((exercise, index) => (
                <li key={index}>{exercise}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}