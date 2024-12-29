'use client';

import AddGym from '@/components/AddGym';
import DisplayGym from '@/components/DisplayGym';

export default function SwitchGym() {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="space-y-6">
                <h2 className="text-xl font-bold">Active GYM</h2>
                    <DisplayGym/>
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Add New Location</h3>
                    <AddGym/>
                </div>
            </div>
        </div>
    );
}