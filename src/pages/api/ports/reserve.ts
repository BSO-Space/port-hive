// src/pages/api/ports/reserve.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import mongoose from 'mongoose';
import Port from '@/app/models/Port';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { port, status, purpose } = req.body;

    // Validate input
    if (!port || !status || !purpose) {
        return res.status(400).json({ message: 'Port, status, and purpose are required' });
    }

    // Ensure database connection
    if (!mongoose.connection.readyState) {
        try {
            await mongoose.connect(process.env.MONGODB_URI as string);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            return res.status(500).json({ message: 'Database connection error' });
        }
    }

    try {
        // Check if the port is already reserved or in use
        const existingPort = await Port.findOne({ port: Number(port) });

        if (existingPort) {
            return res.status(200).json({ message: `Port ${port} is already reserved or in use.` });
        }

        await Port.create({
            port: Number(port),
            status: status,
            purpose: purpose,
            addedBy: 'User',
        });

        console.log(`Reserving port: ${port}, Status: ${status}, Purpose: ${purpose}`);
        res.status(200).json({ message: `Port ${port} reserved successfully.` });
    } catch (error) {
        console.error('Error reserving port:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}