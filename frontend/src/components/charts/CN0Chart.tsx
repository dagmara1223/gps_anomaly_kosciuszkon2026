// src/components/charts/CN0Chart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface CN0Data {
  TOW: number;
  CN0: number;
  Output: number;
}

interface Props {
  data: CN0Data[];
}

const CN0Chart: React.FC<Props> = ({ data }) => {
  // Determine if the current state is an attack based on the latest data point
  const latestPoint = data[data.length - 1];
  const isAttack = latestPoint?.Output > 0;

  // Dynamic colors based on state
  const themeColor = isAttack ? "#ef4444" : "#10b981"; // Red vs Emerald

  return (
    <div className={`w-full h-[350px] p-6 rounded-2xl border transition-all duration-500 ${
      isAttack ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'bg-slate-900 border-slate-800'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Signal Strength (CN0)</h3>
          <p className="text-2xl font-mono font-medium">
            {latestPoint?.CN0.toFixed(2) || "0.00"} <span className="text-sm text-slate-500">dB-Hz</span>
          </p>
        </div>
        {isAttack && (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="text-red-500 text-[10px] font-black uppercase">Spoofing Detected</span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="TOW" 
            hide={true} // TOW is usually a large float, we just need it for ordering
          />
          <YAxis 
            domain={[20, 60]} // Standard GNSS CN0 range
            stroke="#475569"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
            itemStyle={{ color: themeColor }}
            labelStyle={{ display: 'none' }}
          />
          {/* Visual threshold for "Good" signal */}
          <ReferenceLine y={40} stroke="#1e293b" strokeDasharray="3 3" />
          
          <Line
            type="monotone"
            dataKey="CN0"
            stroke={themeColor}
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false} // CRITICAL: Set to false for real-time streaming
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CN0Chart;