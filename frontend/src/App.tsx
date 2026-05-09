// App.tsx
import React, { useState, useEffect } from 'react';
import CN0Chart from './components/charts/CN0Chart';
import { startMockServer } from './utils/mockServer';

// Simple interface for our satellite data
interface GNSSData {
  TOW: number;
  CN0: number;
  Output: number;
  PRN: number;
}

const App = () => {
  const [streamData, setStreamData] = useState<GNSSData[]>([]);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [selectedSat, setSelectedSat] = useState<string>("6");

  useEffect(() => {
    let interval: any;

    if (isLive) {
      // Initialize mock server for testing
      // In production, you'd replace this with your WebSocket logic
      interval = startMockServer((newData: GNSSData) => {
        setStreamData((prev) => {
          const updated = [...prev, newData];
          return updated.slice(-50); // Keep last 50 data points for the chart
        });
      });
    } else {
      setStreamData([]);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  const latestData = streamData[streamData.length - 1];
  const isSpoofed = latestData?.Output > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-emerald-500">
            GNSS_SPOOF_DETECTOR <span className="text-slate-500 text-sm">v1.0.4</span>
          </h1>
          <p className="text-slate-400 text-xs">REAL-TIME SIGNAL INTEGRITY MONITORING</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <select 
            className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-sm outline-none focus:border-emerald-500"
            value={selectedSat}
            onChange={(e) => setSelectedSat(e.target.value)}
          >
            <option value="3">SAT_03</option>
            <option value="4">SAT_04</option>
            <option value="5">SAT_05</option>
            <option value="6">SAT_06</option>
          </select>

          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-6 py-1 rounded text-sm font-bold transition-all ${
              isLive 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isLive ? 'STOP STREAM' : 'START LIVE STREAM'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar Stats */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-500 text-xs uppercase mb-1">Current State</p>
            <p className={`text-xl font-bold ${isSpoofed ? 'text-red-500' : 'text-emerald-500'}`}>
              {isLive ? (isSpoofed ? 'SPOOFING DETECTED' : 'SIGNAL NOMINAL') : 'IDLE'}
            </p>
          </div>
          
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-500 text-xs uppercase mb-1">Latest CN0</p>
            <p className="text-3xl font-light">
              {latestData ? latestData.CN0.toFixed(2) : '--.--'} <span className="text-sm text-slate-500">dB-Hz</span>
            </p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-500 text-xs uppercase mb-1">Time of Week (TOW)</p>
            <p className="text-lg text-slate-300">
              {latestData ? latestData.TOW.toFixed(0) : '000000'}
            </p>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="col-span-12 md:col-span-9">
          {isLive ? (
            <CN0Chart data={streamData} />
          ) : (
            <div className="h-[320px] bg-slate-900/50 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600">
              Select a satellite and start stream to view real-time data
            </div>
          )}
          
          {/* Sandbox Mock Toggle */}
          <div className="mt-6 p-4 bg-slate-900/30 rounded-lg border border-slate-800 italic text-xs text-slate-500">
            Note: The Mock Server simulates an attack every 20 seconds. 
            When <span className="text-red-400">Output = 1.0</span>, the UI will trigger the anomaly state.
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;