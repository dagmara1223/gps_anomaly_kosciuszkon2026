import SatelliteSelector from '../controls/SatelliteSelector';

interface HeaderProps {
  satellites: number[];
  selectedSat: number | null;
  onSelectSat: (id: number) => void;
  activeSection: 'info' | 'live';
  onNavigate: (section: 'info' | 'live') => void;
}

export default function Header({ 
  satellites, 
  selectedSat, 
  onSelectSat, 
  activeSection, 
  onNavigate,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">
        
        <div className="flex flex-row items-center gap-8">
          <div className="cursor-pointer" onClick={() => onNavigate('info')}>
            <h1 className="text-white font-black italic text-xl tracking-tighter leading-none">
              NAV<span className="text-emerald-500">SENTINEL</span>
            </h1>
          </div>

          <nav className="flex flex-row gap-6 border-l border-slate-700 pl-6">
            <button 
              onClick={() => onNavigate('info')}
              className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                activeSection === 'info' ? 'text-emerald-500' : 'text-slate-500 hover:text-white'
              }`}
            >
              Info
            </button>
            <button 
              onClick={() => selectedSat && onNavigate('live')}
              disabled={!selectedSat}
              className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                activeSection === 'live' ? 'text-emerald-500' : 'text-slate-500 hover:text-white disabled:opacity-30'
              }`}
            >
              Live
            </button>
          </nav>
        </div>

        <div className="flex flex-row items-center gap-4">
          <SatelliteSelector 
            satellites={satellites} 
            selectedSat={selectedSat} 
            onSelect={onSelectSat} 
          />
        </div>

      </div>
    </header>
  );
}