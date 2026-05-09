
export default function StatusBadge({ isAttack }: { isAttack: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-500 ${
      isAttack 
      ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
      : 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
    }`}>
      <div className={`w-2 h-2 rounded-full ${isAttack ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
      <span className="text-[10px] font-black uppercase tracking-widest">
        {isAttack ? 'Attack Detected' : 'Signal Safe'}
      </span>
    </div>
  );
}