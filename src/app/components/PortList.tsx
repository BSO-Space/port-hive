"use client"

import React, { useEffect, useState } from 'react';
import { IPort } from '@/app/models/Port';

const PortList: React.FC = () => {
    const [ports, setPorts] = useState<IPort[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch data from the API
        const fetchPorts = async () => {
        try {
            const response = await fetch('/api/ports/in-use');
            if (!response.ok) {
            throw new Error('Failed to fetch ports');
            }
            const data = await response.json();
            setPorts(data.ports);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(String(error));
            }
        } finally {
            setLoading(false);
        }
        };

        fetchPorts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 underline">Active Ports</h2>
        <table className="min-w-full bg-white border">
            <thead>
            <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Port</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Application</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Purpose</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">User</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Status</th>
            </tr>
            </thead>
            <tbody>
            {ports.map((port) => (
                <tr key={port.port} className="hover:bg-gray-100">
                <td className="px-6 py-4 border-b text-sm">{port.port}</td>
                <td className="px-6 py-4 border-b text-sm">{port.application}</td>
                <td className="px-6 py-4 border-b text-sm">{port.purpose || 'N/A'}</td>
                <td className="px-6 py-4 border-b text-sm">{port.addedBy || 'Unknown'}</td>
                <td className="px-6 py-4 border-b text-sm">
                    <span className={`px-2 py-1 font-semibold text-xs rounded ${
                    port.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                    {port.status}
                    </span>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default PortList;