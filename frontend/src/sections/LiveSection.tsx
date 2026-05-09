import { useEffect, useState, useRef } from 'react';
import CN0Chart from '../components/charts/CN0Chart';
import DopplerChart from '../components/charts/DopplerChart';
import MiniChart from '../components/charts/MiniChart';
import SandboxSection from './SandboxSection';
import StatusBadge from '../components/ui/StatusBadge';

export default function LiveSection({satId, SandboxActive,}: {satId: number | null; SandboxActive: boolean;}) {
  const [stream, setStream] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);
  
  // Generate a session ID
  const [sessionId] = useState(() => `sess_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!satId) return;
    
    const url = `${import.meta.env.VITE_WS_URL}/ws/stream?sat=${satId}&session_id=${sessionId}`;
    ws.current = new WebSocket(url);

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setStream((prev) => [...prev, data].slice(-40));
    };

    return () => ws.current?.close();
  }, [satId, sessionId]);

  const latest = stream[stream.length - 1];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <StatusBadge isAttack={latest?.Output ? true : false} />
      
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0"> 
        <div><CN0Chart data={stream} /></div>
        <div><DopplerChart data={stream} /></div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0"> 
        <MiniChart data={stream} dataKey="EC" label="Early Correlator" color="#a855f7" />
        <MiniChart data={stream} dataKey="PC" label="Prompt Correlator" color="#eab308" />
        <MiniChart data={stream} dataKey="LC" label="Late Correlator" color="#f97316" />
      </div>
      {SandboxActive && <SandboxSection websocketId={sessionId} />}
    </div>
  );
}