"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const SettingsPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleSave = () => {
        // Save settings to backend or local storage here
        console.log("Settings saved:", { username, email, darkMode, notificationsEnabled });
        alert("Settings saved successfully!");
    };

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Account Settings Section */}
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

                    <div className="mb-4">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </section>

                {/* Notification Settings Section */}
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Notifications</h2>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="notifications"
                            checked={notificationsEnabled}
                            onCheckedChange={(checked) => setNotificationsEnabled(checked)}
                        />
                        <Label htmlFor="notifications">Enable Notifications</Label>
                    </div>
                </section>

                {/* Appearance Settings Section */}
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Appearance</h2>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="darkMode"
                            checked={darkMode}
                            onCheckedChange={(checked) => setDarkMode(checked)}
                        />
                        <Label htmlFor="darkMode">Dark Mode</Label>
                    </div>
                </section>

                {/* Save Button */}
                <Button onClick={handleSave} className="mt-4">
                    Save Changes
                </Button>
            </CardContent>
        </Card>
    );
};

export default SettingsPage;