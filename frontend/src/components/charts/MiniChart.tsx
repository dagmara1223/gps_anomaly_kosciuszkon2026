import { LineChart, Line, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  data: any[];
  dataKey: string;
  label: string;
  color: string;
}

const MiniChart = ({ data, dataKey, label, color }: MiniChartProps) => {
  const isAttack = data.length > 0 && data[data.length - 1].Output > 0;

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isAttack ? 'bg-red-950/20 border-red-500/50' : 'bg-slate-900/50 border-slate-800'
    }`}>
      <h4 className="text-[10px] uppercase font-bold mb-2 tracking-widest">
        {label}
      </h4>
      <div style={{ width: '100%', height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" vertical={false} />
            <YAxis hide domain={['auto', 'auto']} />
            <Line
              type="stepAfter"
              dataKey={dataKey}
              stroke={isAttack ? "#ef4444" : color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MiniChart;