'use client';
import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

export default function Logout() {
    const router = useRouter();
    useEffect(() => {
        router.push('/login');
    }, [router]);
    return (
        <div>
            <h1>Logout</h1>
        </div>
    );
}