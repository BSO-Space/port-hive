import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import "@/app/globals.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
            <body className="bg-background text-foreground flex">
                <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1 p-6">{children}</main>
                </SidebarProvider>
            </body>
        </html>
    );
};

export default Layout;