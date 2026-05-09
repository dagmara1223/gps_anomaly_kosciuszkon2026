import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useWS } from "../../context/WebSocketProvider";

export default function DopplerChart() {
  const { latest } = useWS();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!latest) return;

    setData((prev) => [...prev.slice(-30), { value: latest.DO }]);
  }, [latest]);

  return (
    <div style={{ height: 200 }}>
      <h4>Doppler</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00ff99"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}