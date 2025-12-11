import React from 'react';
import Button from './Button';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-center text-center p-6 relative overflow-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-[-50px] w-40 h-40 bg-neo-cyan border-4 border-black rotate-12 -z-0"></div>
      <div className="absolute bottom-20 right-[-30px] w-60 h-60 bg-neo-pink rounded-full border-4 border-black -z-0"></div>
      <div className="absolute top-1/2 left-10 w-12 h-12 bg-neo-lime border-2 border-black rotate-45"></div>

      <div className="relative z-10 max-w-4xl border-4 border-black p-6 md:p-12 bg-white shadow-hard-xl">
        <div className="bg-neo-yellow inline-block px-4 py-1 border-2 border-black transform -rotate-2 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="font-mono font-bold text-sm md:text-lg">OFFICIAL DOCUMENTATION</span>
        </div>
        
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl mb-4 leading-none tracking-tighter">
          FOLK<br className="md:hidden" />ATION<br/>4.0
        </h1>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          <div className="bg-neo-black text-white px-6 py-2 font-mono font-bold border-2 border-black text-lg md:text-xl transform rotate-1">
            22-23 DESEMBER 2025
          </div>
          <div className="font-mono font-bold text-lg italic bg-white px-4 py-2 border-2 border-black">
            LOKASI RAHASIA
          </div>
        </div>

        <p className="font-mono text-lg mb-8 max-w-lg mx-auto leading-relaxed">
          Dokumentasi visual kegilaan kita bersama. Jangan lupa pulang, tapi kalau lupa juga gapapa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onCtaClick} className="text-xl px-10 py-4">
            LIHAT GALERI
          </Button>
          <a href="#video" className="block">
             <Button variant="secondary" className="w-full text-xl px-10 py-4 bg-neo-lime hover:bg-lime-400">
              NONTON VIDEO
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
