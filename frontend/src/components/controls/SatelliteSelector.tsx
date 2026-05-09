
interface Props {
  satellites: number[];
  selectedSat: number | null;
  onSelect: (id: number) => void;
}

export default function SatelliteSelector({ satellites, selectedSat, onSelect }: Props) {
  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg">
      <label className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Target_PRN:</label>
      <select 
        value={selectedSat || ""}
        onChange={(e) => onSelect(Number(e.target.value))}
        className="bg-transparent text-emerald-400 font-mono text-sm outline-none cursor-pointer focus:ring-0"
      >
        <option value="" disabled className="bg-slate-900 text-slate-500">Select Sat</option>
        {satellites.map((id) => (
          <option key={id} value={id} className="bg-slate-900 text-white">
            PRN {id.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
    </div>
  );
}