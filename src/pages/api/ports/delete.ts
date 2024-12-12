import type { NextApiRequest, NextApiResponse } from 'next/types';
import dbConnect from '@/app/mongodb';
import Port from '@/app/models/Port';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { port } = req.body;
        if (!port) {
            return res.status(400).json({ message: 'Port number is required' });
        }

        await dbConnect();

        const portDoc = await Port.findOne({ port });
        if (!portDoc) {
            return res.status(404).json({ message: 'Port not found' });
        }

        // Check if port is active
        if (portDoc.status === 'active') {
            return res.status(400).json({ message: 'Cannot delete an active port' });
        }

        await Port.deleteOne({ port });
        return res.status(200).json({ message: 'Port deleted successfully' });
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}