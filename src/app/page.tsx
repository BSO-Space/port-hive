// src/app/page.tsx
import React from 'react';
import PortList from './components/PortList';
import AvailablePort from './components/AvailablePort';

export default function HomePage() {
    return (
        <main>
            <h1>Welcome to PortHive</h1>
            <PortList />
            <AvailablePort />
        </main>
    );
}