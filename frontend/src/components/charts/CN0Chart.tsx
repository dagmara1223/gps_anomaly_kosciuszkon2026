import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CN0Chart = ({ data }: { data: any[] }) => {
  const isSpoofed = data.length > 0 && data[data.length - 1].Output > 0;

  return (
    <div className={`p-4 rounded-xl border ${isSpoofed ? 'bg-red-950/20 border-red-500' : 'bg-slate-900 border-slate-700'}`}>
      <h3 className="text-white mb-4 font-mono text-sm">Live Signal Strength (CN0)</h3>
      
      <div style={{height: 300}}>
        <ResponsiveContainer height="100%" width="100%">
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
              label={{ value: 'dB-Hz', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 12 }}
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
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CN0Chart;