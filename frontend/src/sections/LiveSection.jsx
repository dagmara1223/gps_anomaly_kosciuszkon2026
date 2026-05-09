import React, { useState } from 'react';
import CN0Chart from '../components/charts/CN0Chart';
import { useGNSSStream } from '../hooks/useGNSSStream';

const LiveSection = () => {
  const [satId] = useState<string | null>('6'); // or pass dynamically later
  const { data, status, sendAttackParams } = useGNSSStream(satId);

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-2">Live Satellite Monitor</h1>

      <p className="text-sm text-gray-400 mb-6">
        Status: {status}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CN0Chart data={data} />

        {/* Doppler Chart example placeholder */}
        {/* <DopplerChart data={data} /> */}
      </div>

      {/* Example control (optional) */}
      <button
        className="mt-6 px-4 py-2 bg-blue-600 rounded"
        onClick={() =>
          sendAttackParams({ type: 'test', satId })
        }
      >
        Send Command
      </button>
    </div>
  );
};

export default LiveSection;