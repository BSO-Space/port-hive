import React from "react";
import SettingsPage from "@/components/SettingsPage";
import { Card } from "@/components/ui/card";

const Settings: React.FC = () => {
    return (
        <Card className="max-w-4xl mx-auto p-6">
            <SettingsPage />
        </Card>
    );
};

export default Settings;