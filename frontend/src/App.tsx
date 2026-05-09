import React, { useState, useEffect } from 'react';
import CN0Chart from './components/charts/CN0Chart';

export default function App() {
  const [stream, setStream] = useState<any[]>([]);

  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      
      // Simulate data every 1 second
      const isAttack = (tick % 20) > 12; // Anomaly every 12 seconds
      
      const newPoint = {
        TOW: 491568 + tick,
        CN0: isAttack ? (35 + Math.random() * 5) : (48 + Math.random() * 2),
        Output: isAttack ? 1.0 : 0.0
      };

      setStream((prev) => {
        const next = [...prev, newPoint];
        if (next.length > 40) return next.slice(1); // Keep window of 40 points
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-emerald-500 font-mono text-2xl font-bold">GNSS DASHBOARD TEST</h1>
          <div className="text-slate-400 font-mono">
            STATUS: {stream.length > 0 && stream[stream.length-1].Output > 0 ? 
              <span className="text-red-500 animate-pulse underline">!! ATTACK !!</span> : 
              <span className="text-emerald-500">NOMINAL</span>}
          </div>
        </header>

        {/* This is the chart component */}
        <CN0Chart data={stream} />

        <div className="mt-6 p-4 bg-slate-900 rounded text-slate-500 font-mono text-xs">
          DEBUG_LOG: {JSON.stringify(stream[stream.length - 1])}
        </div>
      </div>
    </div>
  );
}