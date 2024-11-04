// src/pages/api/ports/add.ts
import { NextApiResponse } from 'next/types';
import { ExtendedNextRequest } from '../../../middleware/auth';

interface RequestBody {
    port: string;
    application: string;
    purpose: string;
}
import { basicAuth } from '../../../middleware/auth';
import Port, { IPort } from '../../../app/models/Port';
import mongooseConnect from '../../../app/mongodb';

export default async function handler(req: ExtendedNextRequest, res: NextApiResponse) {
    await mongooseConnect();

    if (!basicAuth(req)) return res.status(401).json({ message: 'Unauthorized' });

    const { port, application, purpose } = JSON.parse(req.body as unknown as string) as RequestBody;
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    if (!port || !application || !purpose) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newPort: IPort = new Port({
        port,
        application,
        purpose,
        status: 'active',
        addedBy: req.user?.username, // TypeScript will now recognize `user` on `req`
        });

        await newPort.save();
        res.status(201).json({ message: 'Port added successfully', newPort });
    } catch (error) {
        res.status(500).json({ message: 'Error adding port', error });
    }
}