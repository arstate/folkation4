import React, { useState, useEffect } from 'react';
import { getEventConfig } from '../services/firebase';
import { VideoConfig } from '../types';

const VideoSection: React.FC = () => {
  const [videos, setVideos] = useState<VideoConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventConfig().then((config) => {
      if (config && config.afterMovies) {
        setVideos(config.afterMovies);
      }
      setLoading(false);
    });
  }, []);

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id ? `https://www.youtube.com/embed/${id}` : null;
  };

  return (
    <section className="py-20 bg-neo-black text-white relative overflow-hidden border-t-4 border-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-5xl md:text-7xl mb-12 text-white">AFTER MOVIE</h2>
        
        {/* Loading State */}
        {loading && (
           <div className="font-mono text-xl animate-pulse">LOADING BROADCAST...</div>
        )}

        {/* Video List */}
        {!loading && videos.length > 0 && (
          <div className="flex flex-col gap-16 max-w-5xl mx-auto">
            {videos.map((video) => {
              const embedUrl = getYoutubeEmbedUrl(video.url);
              if (!embedUrl) return null;

              return (
                <div key={video.id} className="relative group">
                  {/* Decorative Background for each video */}
                  <div className="absolute -inset-2 bg-neo-pink border-4 border-white rotate-1 group-hover:rotate-0 transition-transform -z-0"></div>
                  
                  <div className="relative z-10 bg-neo-black border-4 border-white p-2 md:p-4 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                    <div className="aspect-video w-full bg-black mb-4 overflow-hidden relative">
                      <iframe 
                        src={embedUrl} 
                        title={video.title}
                        className="w-full h-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 border-2 border-black">
                      <h3 className="font-mono font-bold text-black text-lg md:text-2xl text-left uppercase truncate pr-4">
                        {video.title}
                      </h3>
                      <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse shrink-0"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fallback / Coming Soon Placeholder */}
        {!loading && videos.length === 0 && (
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
        )}
      </div>
    </section>
  );
};

export default VideoSection;