import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import VideoSection from './components/VideoSection';
import AdminModal from './components/AdminModal';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<'home' | 'gallery' | 'video'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (section: 'home' | 'gallery' | 'video') => {
    setCurrentSection(section);
    scrollToSection(section);
  };

  return (
    <div className="min-h-screen bg-neo-white text-neo-black selection:bg-neo-pink selection:text-white">
      <Header onNavigate={handleNavigate} currentSection={currentSection} />
      
      <main>
        <div id="home">
          <Hero onCtaClick={() => handleNavigate('gallery')} />
        </div>
        
        <div id="gallery">
          <Gallery />
        </div>
        
        <div id="video">
          <VideoSection />
        </div>
      </main>

      <footer className="bg-neo-white border-t-4 border-black py-8 text-center font-mono">
        <p className="font-bold">
          &copy; 2025 FOLKATION CREATIVE. DIBUAT DENGAN CINTA DAN KOPI.
        </p>
        <div className="mt-4">
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="text-xs text-gray-400 hover:text-neo-pink transition-colors"
          >
            [Mode Admin]
          </button>
        </div>
      </footer>

      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
};

export default App;
