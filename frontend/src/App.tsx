import React, { useEffect, useState, useRef } from 'react';
import CN0Chart from './components/charts/CN0Chart';

type GNSSPacket = {
  TOW: number;
  CN0: number;
  Output: number;
};

export default function App() {
  const [stream, setStream] = useState<GNSSPacket[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socketUrl = "ws://127.0.0.1:8000/ws/stream";

    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        const data: GNSSPacket = JSON.parse(event.data);

        setStream((prev) => {
          const next = [...prev, data];
          return next.slice(-40); // keep last 40 points
        });
      } catch (err) {
        console.error("Invalid JSON from backend:", event.data);
      }
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const latest = stream[stream.length - 1];

  return (
    <div className="min-h-screen bg-black p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl">

        {/* HEADER */}
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-emerald-500 font-mono text-2xl font-bold">
            GNSS DASHBOARD (LIVE)
          </h1>

          <div className="text-slate-400 font-mono">
            STATUS:{' '}
            {latest?.Output ? (
              <span className="text-red-500 animate-pulse underline">
                !! ANOMALY !!
              </span>
            ) : (
              <span className="text-emerald-500">NOMINAL</span>
            )}
          </div>
        </header>

        {/* CHART */}
        <CN0Chart data={stream} />

        {/* DEBUG PANEL */}
        <div className="mt-6 p-4 bg-slate-900 rounded text-slate-400 font-mono text-xs">
          DEBUG_LATEST: {latest ? JSON.stringify(latest) : "waiting for data..."}
        </div>

      </div>
    </div>
  );
}