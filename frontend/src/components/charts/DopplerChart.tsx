import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const DopplerChart = ({ data }: { data: any[] }) => {
  const isSpoofed = data.length > 0 && data[data.length - 1].Output > 0;

  return (
    <div className={`p-4 rounded-xl border transition-colors duration-500 ${isSpoofed ? 'bg-red-950/20 border-red-500' : 'bg-slate-900 border-slate-700'}`}>
      <h3 className="text-white mb-4 font-mono text-sm">Doppler Shift (DO)</h3>
      
      <div style={{height: 300}}>
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="TOW" hide={true} />
            <YAxis 
              domain={['auto', 'auto']}
              stroke="#94a3b8" 
              tick={{fontSize: 11}}
              width={60}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              stroke="#94a3b8" 
              tick={{fontSize: 11}}
              label={{ value: 'Hz', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="5 5" />
            
            <Line
              type="monotone"
              dataKey="DO"
              stroke={isSpoofed ? "#ef4444" : "#22d3ee"}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DopplerChart;