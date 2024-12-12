// src/pages/api/ports/recommend.ts
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { exec } from 'child_process';
import util from 'util';
import axios from 'axios';
import mongoose from 'mongoose';
import Port from '@/app/models/Port';

const execAsync = util.promisify(exec);

// Check if a port is currently in use on the server
async function getPortsInUseOnServer(): Promise<Set<number>> {
    try {
        const { stdout } = await execAsync(`netstat -tuln | grep LISTEN`);
        const ports = stdout
            .split('\n')
            .map(line => {
                const match = line.match(/:(\d+)\s+/);
                return match ? parseInt(match[1], 10) : null;
            })
            .filter((port): port is number => port !== null);

        return new Set(ports);
    } catch (error) {
        console.error('Error checking ports in use on server:', error);
        return new Set(); // Return empty set on error
    }
}

// Fetch active and reserved ports from /api/ports/in-use
async function getPortsInUseFromApi(): Promise<Set<number>> {
    try {
        const response = await axios.get('/api/ports/in-use');
        const ports = (response.data as { ports: { status: string; port: number }[] }).ports || [];

        // Collect ports with "active" or "reserved" status only
        const portsInUse = ports
            .filter(port => port.status === 'active' || port.status === 'reserved')
            .map(port => port.port);

        return new Set(portsInUse);
    } catch (error) {
        console.error('Error fetching ports from /api/ports/in-use:', error);
        return new Set(); // Return empty set on error
    }
}

// Fetch all "active" or "reserved" ports from the database
async function getPortsInUseFromDb(): Promise<Set<number>> {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const ports = await Port.find({ status: { $in: ['active', 'reserved'] } }).select('port').lean();
    return new Set(ports.map(portDoc => portDoc.port));
}

// Function to find an available port starting from a given port
async function findAvailablePort(startPort: number): Promise<number> {
    const [portsInUseOnServer, portsInUseFromApi, portsInUseFromDb] = await Promise.all([
        getPortsInUseOnServer(),
        getPortsInUseFromApi(),
        getPortsInUseFromDb()
    ]);

    // Merge all ports in use into one set for faster lookups
    const allPortsInUse = new Set([...portsInUseOnServer, ...portsInUseFromApi, ...portsInUseFromDb]);

    let port = startPort;
    while (allPortsInUse.has(port)) {
        port += 1; // Increment the port if it's in use
    }

    return port;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const startPort = parseInt(req.query.start as string, 10) || 3000;

    try {
        // Find the first available port starting from startPort
        const availablePort = await findAvailablePort(startPort);
        res.status(200).json({ availablePort });
    } catch (error) {
        console.error('Error finding available port:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}