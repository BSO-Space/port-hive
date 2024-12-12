"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PortChecker() {
    const [port, setPort] = useState<number | null>(null);
    const [status, setStatus] = useState<string>('');
    const [purpose, setPurpose] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const reservePort = async () => {
        if (port === null || !status || !purpose) {
            setMessage('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post('/api/ports/reserve', {
                port,
                status,
                purpose,
            });
            const data = response.data as { message: string };
            setMessage(data.message || 'Port reserved successfully!');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error reserving port:', error);

            if (error.response) {
                setMessage(error.response.data.message || 'Error reserving port');
            } else {
                setMessage('Network error or server is unreachable');
            }
        }
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>Port Checker</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Input fields */}
                <div className="mb-4">
                    <Label htmlFor="port" className="mb-2">
                        Enter Port Number
                    </Label>
                    <Input
                        id="port"
                        type="number"
                        value={port || ''}
                        onChange={(e) => setPort(parseInt(e.target.value, 10))}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="status" className="mb-2">
                        Status
                    </Label>
                    <Select
                        value={status}
                        onValueChange={(value) => setStatus(value)}
                    >
                        <SelectTrigger id="status" className="w-full">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-4">
                    <Label htmlFor="purpose" className="mb-2">
                        Purpose
                    </Label>
                    <Input
                        id="purpose"
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                    />
                </div>

                {/* Reserve Button */}
                <Button onClick={reservePort}>Reserve Port</Button>

                {/* Display Message */}
                {message && (
                    <p className="mt-4 text-sm text-muted-foreground">
                        {message}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}