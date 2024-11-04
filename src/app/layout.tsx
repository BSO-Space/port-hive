import React from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>PortHive</h1>
        </header>
        <main>{children}</main>
        <footer>© PortHive 2024</footer>
      </body>
    </html>
  );
}