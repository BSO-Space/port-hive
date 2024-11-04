"use client"

import React, { useEffect, useState } from 'react';

interface PortUsage {
  command: string;
  pid: string;
  user: string;
  port: string;
}

const PortUsage: React.FC = () => {
  const [usedPorts, setUsedPorts] = useState<PortUsage[]>([]);

  useEffect(() => {
    async function fetchUsedPorts() {
      const response = await fetch('/api/ports/in-use');
      const data = await response.json();
      setUsedPorts(data);
    }
    fetchUsedPorts();
  }, []);

  return (
    <div>
      <h2>Ports Currently in Use</h2>
      <ul>
        {usedPorts.map((port, index) => (
          <li key={index}>
            Command: {port.command} | PID: {port.pid} | User: {port.user} | Port: {port.port}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortUsage;