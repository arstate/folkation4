import React from 'react';

const VideoSection: React.FC = () => {
  return (
    <section className="py-20 bg-neo-black text-white relative overflow-hidden border-t-4 border-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-5xl md:text-7xl mb-8 text-white">AFTER MOVIE</h2>
        
        <div className="relative max-w-4xl mx-auto aspect-video bg-gray-900 border-4 border-white shadow-[8px_8px_0px_0px_#FF00FF] flex items-center justify-center overflow-hidden">
          {/* Static Noise Background */}
          <div className="absolute inset-0 opacity-20" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}>
          </div>
          
          {/* Scanline Effect */}
          <div className="scanline"></div>

          {/* Text Content */}
          <div className="relative z-20 transform -rotate-2">
            <h3 className="font-display text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-neo-cyan to-neo-pink animate-pulse tracking-widest">
              COMING SOON
            </h3>
            <div className="bg-neo-lime text-black font-mono font-bold text-xl inline-block px-4 py-1 mt-4 border-2 border-black">
              LAGI DIEDIT EDITOR
            </div>
          </div>

          {/* Glitch Overlay Elements */}
          <div className="absolute top-10 left-10 w-full h-1 bg-white opacity-20"></div>
          <div className="absolute bottom-20 right-0 w-full h-2 bg-neo-cyan opacity-20"></div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
