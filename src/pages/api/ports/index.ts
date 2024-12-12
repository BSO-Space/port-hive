import type { NextApiRequest, NextApiResponse } from 'next/types';
import connectToDatabase from '@/app/mongodb';
import Port from '@/app/models/Port';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();
    const ports = await Port.find({});
    res.status(200).json(ports);
}