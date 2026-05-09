import { useState } from 'react';
import LiveSection from './LiveSection';
import SandboxSection from './SandboxSection';

type Role = 'OPERATOR' | 'ATTACKER' | null;

export default function GameSection({ satId }: { satId: number | null }) {
  const [role, setRole] = useState<Role>(null);
  const [gameCode, setGameCode] = useState("");
  
  const [activeSessionId, setActiveSessionId] = useState(() => 
    `sess_${Math.random().toString(36).substring(2, 11)}`
  );
  
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_WS_URL;

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/game/create?websocket_id=${activeSessionId}`, {
        method: 'POST',
        headers: { 
            'ngrok-skip-browser-warning': 'true'
          },
      });
      const data = await resp.json();
      
      setGameCode(data.code);
      setActiveSessionId(data.session_id); 
      setRole('OPERATOR');
      setIsJoined(true);
    } catch (err) {
      console.error("Create game failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/game/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            code: gameCode, 
            websocket_id: activeSessionId
        })
      });
      const data = await resp.json();

      if (data.status === "joined") {
        setActiveSessionId(data.session_id);
        setRole('ATTACKER');
        setIsJoined(true);
      } else {
        alert("INVALID_CODE: Access Denied");
      }
    } catch (err) {
      console.error("Join game failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isJoined) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-slate-800 rounded-3xl bg-slate-900/20 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2">SYSTEM_COLLABORATION</h2>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em]">Select Connection Protocol</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* HOST SIDE */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative p-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full">
              <span className="text-emerald-500 font-mono text-[10px] mb-2 font-bold tracking-widest text-left">PROTOCOL: HOST</span>
              <h3 className="text-xl font-bold text-white mb-4 text-left">Create Defense Node</h3>
              <p className="text-xs text-slate-500 mb-8 flex-grow leading-relaxed">Generates a unique session code. You will monitor signal integrity and detect spoofing attempts.</p>
              <button 
                onClick={handleCreateGame} 
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? "INITIALIZING..." : "GENERATE_CODE"}
              </button>
            </div>
          </div>

          {/* JOIN SIDE */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-red-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative p-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full">
              <span className="text-red-500 font-mono text-[10px] mb-2 font-bold tracking-widest text-left">PROTOCOL: INTRUDE</span>
              <h3 className="text-xl font-bold text-white mb-4 text-left">Join Attack Vector</h3>
              <input 
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="SESSION_CODE" 
                className="w-full bg-black border border-slate-700 p-4 rounded-xl mb-4 font-mono text-center text-red-500 focus:outline-none focus:border-red-500 placeholder:text-slate-800"
              />
              <button 
                onClick={handleJoinGame} 
                disabled={loading}
                className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-black rounded-xl transition-all"
              >
                {loading ? "CONNECTING..." : "INITIALIZE_ATTACK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex justify-between items-center bg-slate-950 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Session_ID</span>
            <span className="text-xs font-mono text-slate-300">{activeSessionId}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Game_Code</span>
            <span className="text-sm font-black text-emerald-400 font-mono">{gameCode}</span>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${role === 'OPERATOR' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
          ROLE: {role}
        </div>
      </div>

      {role === 'OPERATOR' ? (
        <LiveSection satId={satId} gameCode={gameCode} hideSandbox={true} />
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <SandboxSection websocketId={activeSessionId} />
          <div className="mt-8 p-6 bg-red-950/10 border border-red-900/30 rounded-2xl text-center">
             <p className="text-xs text-red-400 font-mono">
               📡 <span className="animate-pulse">UPLINK_ESTABLISHED:</span> Adjust sliders to manipulate the Operator's live stream.
             </p>
          </div>
        </div>
      )}
    </div>
  );
}