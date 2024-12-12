"use client";

import React, { useState } from 'react';
import { FaPlug } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AvailablePort() {
    const [availablePort, setAvailablePort] = useState<number | null>(null);

    const findPort = () => {
        fetch('/api/ports/recommend')
            .then(res => res.json())
            .then(data => setAvailablePort(data.availablePort))
            .catch(error => console.error('Error finding available port:', error));
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle className="text-center">Find Available Port</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <Button onClick={findPort} className="flex items-center gap-2">
                    <FaPlug className="text-lg" />
                    Get Available Port
                </Button>
                {availablePort && (
                    <p className="mt-3 text-lg font-semibold text-success">
                        Recommended Port: <span className="text-primary">{availablePort}</span>
                    </p>
                )}
            </CardContent>
        </Card>
    );
}