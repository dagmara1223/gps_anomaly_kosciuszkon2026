import { useState } from 'react';
import InfoSection from './sections/InfoSection';
import LiveSection from './sections/LiveSection';
import Header from './components/ui/Header';

export default function App() {
  const [activeSection, setActiveSection] = useState<'info' | 'live'>('info');
  const [selectedSat, setSelectedSat] = useState<number | null>(null);

  const satellites = [1, 2, 3, 4, 5, 6]; 

  const handleSelectSat = (id: number) => {
    setSelectedSat(id);
    setActiveSection('live');
  };

  return (
    <div className="min-h-screen bg-black">
      <Header 
      satellites={satellites}
      selectedSat={selectedSat}
      onSelectSat={handleSelectSat}
      activeSection={activeSection}
      onNavigate={setActiveSection}
    />

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {activeSection === 'info' ? (
          <InfoSection/>
        ) : (
          <LiveSection satId={selectedSat} />
        )}
      </main>
    </div>
  );
}