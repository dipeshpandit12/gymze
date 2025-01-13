"use client";

import { useEffect, useState } from "react";


interface Equipment {
    detected_items: string[];
}

export default function Dashboard() {
    const [equipment, setEquipment] = useState<Equipment['detected_items']>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/dashboard");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch equipment");
            }

            // Parse detected_items from response
            const detectedItems = data.equipment.detected_items || [];
            setEquipment(Array.isArray(detectedItems) ? detectedItems : [detectedItems]);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Detected Equipment</h2>
            <ul className="space-y-2">
                {equipment.length === 0 ? (
                    <p>No equipment detected</p>
                ) : (
                    equipment.map((item, index) => (
                        <li key={index} className="p-2 bg-black rounded">
                            {item}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}