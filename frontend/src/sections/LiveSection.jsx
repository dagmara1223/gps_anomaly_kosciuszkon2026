import React, { useState, useEffect } from 'react';
import CN0Chart from '../components/charts/CN0Chart';
import { startMockServer } from '../utils/mockServer';

const LiveSection = () => {
  const [streamData, setStreamData] = useState<any[]>([]);

  useEffect(() => {
    // Start the mock server
    const interval = startMockServer((newData) => {
      setStreamData((prev) => {
        const updated = [...prev, newData];
        return updated.slice(-30); // Keep last 30 seconds of data
      });
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Live Satellite Monitor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CN0Chart data={streamData} />
        {/* Doppler Chart would go here */}
      </div>
    </div>
  );
};