import type { NextApiRequest, NextApiResponse } from 'next/types';
import dbConnect from '@/app/mongodb';
import Port from '@/app/models/Port';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { port, application, purpose, status } = req.body;
        if (!port) {
            return res.status(400).json({ message: 'Port number is required' });
        }

        await dbConnect();

        // Update only provided fields, keep existing values for others
        const updateData: { application?: string; purpose?: string; status?: string } = {};
        if (application) updateData.application = application;
        if (purpose) updateData.purpose = purpose;
        if (status) updateData.status = status;

        const updatedPort = await Port.findOneAndUpdate(
            { port },
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: 'Port information updated', updatedPort });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}