import React, { useEffect, useState, useRef, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function GPSGraphViewer() {
  const [graphs, setGraphs] = useState<any[]>([]);
  const [selected, setSelected] = useState(0);
  const graphRef = useRef<any>();

  useEffect(() => {
    fetch("/gps_graphs.json")
      .then((res) => res.json())
      .then((data) => setGraphs(data));
  }, []);

  
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
  const { x, y, color, features } = node;
  
  if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
    return;
  }

  const size = 6;
  
  try {

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
    gradient.addColorStop(0, color || '#4ade80');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 2.5, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.fillStyle = color || '#4ade80';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    ctx.fill();

    if (globalScale > 3) {
      ctx.font = `${4}px JetBrains Mono`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(node.label || '', x, y + 10);
    }
  } catch (err) {
    console.warn("Canvas drawing skip");
  }
}, []);
  if (!graphs.length) return <div className="text-emerald-500 font-mono p-10">INITIALIZING_SCANNER...</div>;

  const currentGraph = graphs[selected];

  return (
    <div className="flex flex-col gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl">
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-white font-black italic uppercase text-xl tracking-tighter">Topology_Intelligence_v4</h3>
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Relational Correlation Map</p>
        </div>
        
        <div className="flex gap-4">
          <div className="text-right">
             <p className="text-[10px] text-slate-500 uppercase">Analysis_Target</p>
             <select 
               className="bg-transparent text-emerald-400 font-mono text-sm border-none focus:ring-0 p-0 cursor-pointer"
               onChange={(e) => setSelected(Number(e.target.value))}
             >
               {graphs.map((g, i) => (
                 <option key={i} value={i} className="bg-slate-900 italic">SIG_SET_{i} [{g.label_name}]</option>
               ))}
             </select>
          </div>
        </div>
      </div>

      <div className="relative h-[450px] w-full bg-black rounded-2xl overflow-hidden border border-slate-900">
        <div className="absolute top-4 left-4 z-10 pointer-events-none space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${currentGraph.label === 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-[10px] font-mono text-white uppercase tracking-tighter">
              {currentGraph.label_name} // CLASSIFICATION_MATCH
            </span>
          </div>
        </div>

        <ForceGraph2D
          ref={graphRef}
          graphData={{ nodes: currentGraph.nodes, links: currentGraph.edges }}
          nodeCanvasObject={paintNode}
          linkColor={() => 'rgba(255, 255, 255, 0.2)'}
          linkWidth={link => (link as any).thickness}
          backgroundColor="#000000"
          d3AlphaDecay={0.05}
          d3VelocityDecay={0.1}
          cooldownTicks={100}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatBox label="Nodes" value={currentGraph.nodes.length} color="text-blue-400" />
        <StatBox label="Edges" value={currentGraph.edges.length} color="text-purple-400" />
        <StatBox label="Avg_Weight" value={ (currentGraph.edges.reduce((a: any, b: any) => a + b.weight, 0) / currentGraph.edges.length).toFixed(2) } color="text-emerald-400" />
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
      <p className="text-[9px] text-slate-500 uppercase font-bold">{label}</p>
      <p className={`text-lg font-mono font-black ${color}`}>{value}</p>
    </div>
  );
}