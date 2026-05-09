// hooks/useGNSSStream.ts
import { useState, useEffect, useRef } from 'react';

export const useGNSSStream = (satId: string | null) => {
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!satId) return;

    setStatus('connecting');
    ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/stream?sat=${satId}`);

    ws.current.onopen = () => setStatus('connected');
    ws.current.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      setData((prev) => [...prev.slice(-49), payload]); // Keep last 50 points
    };
    ws.current.onerror = () => setStatus('error');
    ws.current.onclose = () => setStatus('idle');

    return () => ws.current?.close();
  }, [satId]);

  const sendAttackParams = (params: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(params));
    }
  };

  return { data, status, sendAttackParams };
};