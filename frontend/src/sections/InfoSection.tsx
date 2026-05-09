import GPSGraphViewer from '../components/charts/GPSGraphViewer';

export default function InfoSection() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-4 text-left">
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Overview</h2>
        <p className="text-slate-400 leading-relaxed">
          This dashboard provides real-time detection of GNSS spoofing attacks using a 
          Random Forest classifier trained on raw satellite correlator data. 
          By monitoring anomalies in signal strength (CN0), Doppler shifts, and correlator 
          outputs (EC, PC, LC), we can distinguish between authentic orbital signals and 
          malicious terrestrial injections.
        </p>
      </section>

      {/* NOWA SEKCJA Z GRAFEM */}
      <section className="space-y-6 text-left border-l-2 border-slate-800 pl-6 py-2">
        {/* Header z animowanym pulsem */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                Signal_Topology_Intelligence
              </h3>
            </div>
          </div>
        </div>

        {/* Opis z highlightami */}
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Graph analysis visualizes <span className="text-slate-200 font-semibold">relational dependencies</span> between satellite channels. 
          Nodes represent PRNs, while edges map spatial-temporal correlation. 
          Under <span className="text-red-500 font-bold bg-red-500/5 px-1 rounded">SPOOFING_DETECTION</span>, 
          the topology exhibits unnatural clustering as malicious emitters force identical signal characteristics across multiple channels.
        </p>

        {/* Główny komponent grafu */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative">
            <GPSGraphViewer />
          </div>
        </div>

      </section>
      <div className="bg-blue-950/20 border border-blue-500/30 p-6 rounded-xl space-y-2 text-left">
        <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest">System Manual</h4>
        <p className="text-slate-400 text-[11px] leading-relaxed font-mono">
          1. ANALYZE signal topology above for structural anomalies.<br/>
          2. SELECT a PRN Target from the list to initiate deep inspection.<br/>
          3. MONITOR real-time Doppler and CN0 shifts for spoofing signatures.
        </p>
      </div>

    </div>
  );
}