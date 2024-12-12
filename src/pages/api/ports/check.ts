import { NextApiRequest, NextApiResponse } from 'next/types';
import mongoose from 'mongoose';
import Port from '@/app/models/Port';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { port } = req.query;

    if (!port) {
        return res.status(400).json({ message: 'Port number is required' });
    }

    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }

    try {
        const portInUse = await Port.findOne({ port: Number(port)});

        const isInUse = !!portInUse;
        res.status(200).json({ isInUse });
    } catch (error) {
        console.error('Error checking port:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}