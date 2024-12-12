import React from "react";
import AvailablePort from "@/components/AvailablePort";
import PortList from "@/components/PortList";
import PortChecker from "@/components/PortChecker";

export default function HomePage() {
    return (
        <div className="flex flex-col items-center gap-6 p-6 min-h-screen bg-background">
            <header className="w-full max-w-4xl text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-primary">
                    Welcome to PortHive
                </h1>
            </header>
            <main className="w-full max-w-4xl flex flex-col gap-6">
                <PortChecker />
                <AvailablePort />
                <PortList />
            </main>
        </div>
    );
}