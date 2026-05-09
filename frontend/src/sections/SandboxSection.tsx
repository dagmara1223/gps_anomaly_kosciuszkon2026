import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import AttackSliders from '../components/controls/AttackSliders';

interface SandboxProps {
  websocketId: string;
}

const ATTACK_MODES = [
  { id: 0, label: 'OFF', color: 'bg-emerald-500' },
  { id: 1, label: 'NOISE ATTACK', color: 'bg-yellow-500' },
  { id: 2, label: 'SPOOF', color: 'bg-red-500' },
];

export default function SandboxSection({ websocketId }: SandboxProps) {
  const [params, setParams] = useState({
    cn0_scale: 1.0,
    noise_level: 0.5,
    doppler_shift: 0,
    pseudorange_bias: 0,
    time_drift: 0,
    attack_mode: 0,
  });

  const updateBackend = useCallback(
    debounce(async (newParams) => {
      try {
        await fetch(`${import.meta.env.VITE_WS_URL}/change_metrics?websocket_id=${websocketId}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify(newParams),
        });
      } catch (err) {
        console.error("Failed to update sandbox metrics:", err);
      }
    }, 300),
    [websocketId]
  );

  const handleChange = (key: string, value: number) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
    updateBackend(updated);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mt-8 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        <h3 className="text-white font-bold uppercase tracking-tighter text-lg">Sandbox</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AttackSliders params={params} onParamChange={handleChange} />
        <div className="flex flex-col justify-center gap-4 border-l border-slate-800 pl-8">
          <label className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Mode Selection</label>
          
          {ATTACK_MODES.map((mode) => {
            const isActive = params.attack_mode === mode.id;
            
            return (
              <button
                key={mode.id}
                onClick={() => handleChange('attack_mode', mode.id)}
                className={`btn-glass px-4 py-4 w-full justify-between transition-transform ${
                  isActive ? 'btn-glass-active translate-x-2' : 'hover:translate-x-1' }`}
                style={{'--btn-accent': mode.color,'--btn-glow': mode.glow,} as React.CSSProperties}
              >
                <span className="tracking-tight">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}