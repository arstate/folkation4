import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import VideoSection from './components/VideoSection';
import AdminModal from './components/AdminModal';

// Separate Home Component
const Home: React.FC = () => {
    const location = useLocation();

    // Handle scroll to hash
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                // Add a small delay to ensure page is rendered
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    return (
        <>
            <div id="home">
                <Hero />
            </div>
            <div id="video">
                <VideoSection />
            </div>
        </>
    );
}

const App: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <HashRouter>
      <div className="min-h-screen bg-neo-white text-neo-black selection:bg-neo-pink selection:text-white">
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Adding key forces remount when switching between days */}
            <Route path="/day1" element={<Gallery key="day1" day="day1" />} />
            <Route path="/day2" element={<Gallery key="day2" day="day2" />} />
          </Routes>
        </main>

        <footer className="bg-neo-white border-t-4 border-black py-8 text-center font-mono">
          <p className="font-bold">
            &copy; 2025 FOLKATION 4.0. DIBUAT DENGAN CINTA DAN KOPI.
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
    </HashRouter>
  );
};

export default App;