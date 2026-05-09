import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CN0Chart = ({ data }: { data: any[] }) => {
  // Determine if we are under attack based on the last data point
  const isSpoofed = data.length > 0 && data[data.length - 1].Output > 0;

  return (
    <div className={`p-4 rounded-xl border ${isSpoofed ? 'bg-red-950/20 border-red-500' : 'bg-slate-900 border-slate-700'}`}>
      <h3 className="text-white mb-4 font-mono text-sm">LIVE_SIGNAL_STRENGTH (CN0)</h3>
      
      {/* Container must have a height for ResponsiveContainer to work */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="TOW" 
              hide={true} 
            />
            <YAxis 
              domain={[30, 55]} 
              stroke="#94a3b8" 
              tick={{fontSize: 12}}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} 
            />
            <Line
              type="monotone"
              dataKey="CN0"
              stroke={isSpoofed ? "#ef4444" : "#10b981"}
              strokeWidth={3}
              dot={false}
              isAnimationActive={false} // Makes it update instantly
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CN0Chart;