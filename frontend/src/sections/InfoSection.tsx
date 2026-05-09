
export default function InfoSection() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-4">
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Overview</h2>
        <p className="text-slate-400 leading-relaxed">
          This dashboard provides real-time detection of GNSS spoofing attacks using a 
          Random Forest classifier trained on raw satellite correlator data. 
          By monitoring anomalies in signal strength (CN0), Doppler shifts, and correlator 
          outputs (EC, PC, LC), we can distinguish between authentic orbital signals and 
          malicious terrestrial injections.
        </p>
      </section>


      <div className="bg-blue-950/20 border border-blue-500/30 p-6 rounded-xl space-y-2">
        <h4 className="text-blue-400 text-xs font-bold uppercase">System Manual</h4>
        <p className="text-slate-400 text-xs leading-relaxed">
          Select a PRN (Pseudo-Random Noise) ID above to initiate a real-time 
          WebSocket stream from the detection backend. The system will automatically 
          flag anomalies if signal characteristics deviate from expected orbital physics.
        </p>
      </div>
    </div>
  );
}