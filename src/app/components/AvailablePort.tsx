"use client"

import React, { useState } from 'react';

export default function AvailablePort() {
    const [availablePort, setAvailablePort] = useState<number | null>(null);

    const findPort = () => {
        fetch('/api/ports/recommend')
            .then(res => res.json())
            .then(data => setAvailablePort(data.availablePort))
            .catch(error => console.error('Error finding available port:', error));
    };

    return (
        <div>
            <h2>Find Available Port</h2>
            <button onClick={findPort}>Get Available Port</button>
            {availablePort && <p>Recommended Port: {availablePort}</p>}
        </div>
    );
}