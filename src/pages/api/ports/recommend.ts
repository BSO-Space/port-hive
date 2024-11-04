// src/pages/api/ports/recommend.ts
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { exec } from 'child_process';

// Function to check if a port is in use
function isPortInUse(port: number, callback: (inUse: boolean) => void) {
    exec(`netstat -tuln | grep :${port}`, (error, stdout) => {
        callback(stdout.includes(`:${port}`));
    });
}

// Recommend an available port
function findAvailablePort(startPort: number, callback: (port: number) => void) {
    isPortInUse(startPort, inUse => {
        if (!inUse) {
            callback(startPort);
        } else {
            findAvailablePort(startPort + 1, callback); // Check the next port
        }
    });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const startPort = parseInt(req.query.start as string, 10) || 3000;

    findAvailablePort(startPort, availablePort => {
        res.status(200).json({ availablePort });
    });
}