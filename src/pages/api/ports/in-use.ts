// src/pages/api/ports/in-use.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import Port from '@/app/models/Port';
import mongoose from 'mongoose';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

async function isCommandAvailable(command: string): Promise<boolean> {
  try {
    await execAsync(`command -v ${command.split(' ')[0]}`);
    return true;
  } catch {
    return false;
  }
}

async function getActivePorts(): Promise<number[]> {
  const commandList = [
    { command: 'ss -tuln | grep LISTEN', label: 'ss' },
    { command: 'lsof -i -P -n | grep LISTEN', label: 'lsof' },
    { command: 'netstat -tuln | grep LISTEN', label: 'netstat' },
  ];

  for (const { command, label } of commandList) {
    const isAvailable = await isCommandAvailable(label);
    if (!isAvailable) {
      console.warn(`Command "${label}" is not available on this system.`);
      continue;
    }

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
        console.log(`Successfully retrieved ports using: ${command}`);
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

    // Get active ports from the device
    const devicePorts = await getActivePorts();
    if (devicePorts.length === 0) {
      return res.status(500).json({ error: 'No active ports found or all detection methods failed.' });
    }

    // Upsert each port in the database
    for (const port of devicePorts) {
      await Port.updateOne(
        { port }, // Find document by port number
        {
          port,
          application: 'Unknown',
          purpose: 'Not specified',
          addedBy: 'System',
          status: 'active',
        },
        { upsert: true }
      );
    }

    // Fetch all active ports, sorted by user-added data first and then by port number
    const allActivePorts = await Port.find({ status: 'active' })
      .sort({ addedBy: 1, port: 1 }) // Primary sort by `addedBy`, secondary sort by `port` number
      .select('port application purpose addedBy')
      .lean();

    res.status(200).json({ ports: allActivePorts });
  } catch (error) {
    console.error('Error fetching in-use ports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}