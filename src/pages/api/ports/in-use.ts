// src/pages/api/ports/in-use.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import mongoose from 'mongoose';
import Port from '@/app/models/Port';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

// Helper function to check if a command is available
async function isCommandAvailable(command: string): Promise<boolean> {
    try {
        await execAsync(`command -v ${command.split(' ')[0]}`);
        return true;
    } catch {
        return false;
    }
}

// Fetch active ports from the server
export async function getServerActivePorts(): Promise<number[]> {
    const commandList = [
        { command: 'ss -tuln | grep LISTEN', label: 'ss' },
        { command: 'lsof -i -P -n | grep LISTEN', label: 'lsof' },
        { command: 'netstat -tuln | grep LISTEN', label: 'netstat' },
    ];

    for (const { command, label } of commandList) {
        const isAvailable = await isCommandAvailable(label);
        if (!isAvailable) continue;

        try {
            const { stdout } = await execAsync(command);
            const ports = stdout
                .split('\n')
                .map((line) => {
                    const match = line.match(/:(\d+)\s+/);
                    return match ? parseInt(match[1], 10) : null;
                })
                .filter((port): port is number => port !== null);

            if (ports.length > 0) {
                return ports;
            }
        } catch (error) {
            console.warn(`Failed to execute command "${command}":`, error);
        }
    }

    return [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Ensure database connection
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }

        // Get actual active ports from the server
        const activePortsOnServer = new Set(await getServerActivePorts());

        // Fetch all ports from the database
        const dbPorts = await Port.find().lean();

        // Update database records based on comparison with real server active ports
        for (const dbPort of dbPorts) {
            if (activePortsOnServer.has(dbPort.port)) {
                // Port exists on the server, mark as active in the database
                await Port.updateOne({ port: dbPort.port }, { status: 'active' });
            } else if (dbPort.status === 'active') {
                // Port does not exist on the server but is marked as active in the DB, set to inactive
                await Port.updateOne({ port: dbPort.port }, { status: 'inactive' });
            }
        }

        // Insert any new active ports from the server into the database with default values if they don't exist
        for (const port of activePortsOnServer) {
            const existsInDB = dbPorts.some(dbPort => dbPort.port === port);
            if (!existsInDB) {
                await Port.create({
                    port,
                    purpose: 'Not specified',
                    addedBy: 'System',
                    status: 'active',
                });
            }
        }

        // Fetch updated list of ports to return
        const allPorts = await Port.find().sort({ port: 1 }).lean();
        res.status(200).json({ ports: allPorts });
    } catch (error) {
        console.error('Error fetching in-use ports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}