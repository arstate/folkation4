import React, { useState, useEffect } from 'react';
import { DriveFile, TabType, EventConfig } from '../types';
import { fetchDriveFiles, extractFolderId } from '../services/googleDrive';
import { getEventConfig } from '../services/firebase';
import Button from './Button';
import PhotoModal from './PhotoModal';

const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('day1');
  const [photos, setPhotos] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<DriveFile | null>(null);

  useEffect(() => {
    // Load config on mount
    getEventConfig().then((data) => {
      if (data) setConfig(data);
    });
  }, []);

  useEffect(() => {
    const loadPhotos = async () => {
      if (!config) return;

      setLoading(true);
      setError(null);
      setPhotos([]);

      const url = activeTab === 'day1' ? config.day1FolderUrl : config.day2FolderUrl;
      const folderId = extractFolderId(url);

      if (!folderId) {
        setError("Link folder belum diset sama Admin. Sabar ya!");
        setLoading(false);
        return;
      }

      try {
        const files = await fetchDriveFiles(folderId);
        setPhotos(files);
      } catch (err) {
        setError("Gagal ambil foto. Mungkin folder diprivate atau API limit.");
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [activeTab, config]);

  const cardColors = ['bg-white', 'bg-neo-cyan', 'bg-neo-lime', 'bg-neo-pink', 'bg-neo-yellow'];

  return (
    <section className="py-12 px-4 md:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-5xl md:text-7xl mb-12 text-center text-stroke-black">
          GALERI <span className="text-neo-pink">SERU</span>
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button
            onClick={() => setActiveTab('day1')}
            className={`
              font-mono text-xl md:text-2xl font-bold px-8 py-3 border-4 border-black transition-all
              ${activeTab === 'day1' 
                ? 'bg-neo-yellow shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-2' 
                : 'bg-white hover:bg-gray-100 hover:-translate-y-1'
              }
            `}
          >
            DAY 01
          </button>
          <button
            onClick={() => setActiveTab('day2')}
            className={`
              font-mono text-xl md:text-2xl font-bold px-8 py-3 border-4 border-black transition-all
              ${activeTab === 'day2' 
                ? 'bg-neo-cyan shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-2' 
                : 'bg-white hover:bg-gray-100 hover:-translate-y-1'
              }
            `}
          >
            DAY 02
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin w-16 h-16 border-8 border-black border-t-neo-lime rounded-full mb-4"></div>
              <p className="font-mono font-bold text-xl animate-pulse">LAGI LOADING BOS...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-100 border-4 border-black p-8 text-center shadow-hard">
              <p className="font-mono font-bold text-xl text-red-600 mb-4">{error}</p>
              <p className="font-mono">Coba kontak panitia buat benerin link Drivenya.</p>
            </div>
          )}

          {!loading && !error && photos.length === 0 && config && (
            <div className="text-center p-12 border-4 border-black border-dashed bg-white">
              <p className="font-mono font-bold text-2xl text-gray-400">ZONK! BELUM ADA FOTO.</p>
            </div>
          )}

          {!loading && !error && photos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((photo, index) => {
                // Determine layout spans for masonry-like feel (randomized safely)
                const isLarge = index % 7 === 0;
                const rotate = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
                const color = cardColors[index % cardColors.length];
                
                return (
                  <div 
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`
                      group relative cursor-pointer border-4 border-black p-2 transition-all duration-300
                      hover:scale-105 hover:z-10 shadow-hard hover:shadow-hard-xl
                      ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
                      ${rotate}
                      ${color}
                    `}
                  >
                    <div className="overflow-hidden border-2 border-black h-full w-full bg-gray-200">
                      <img 
                        src={photo.thumbnailLink?.replace('=s220', '=s600')} 
                        alt={photo.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black text-white text-xs font-mono px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      LIHAT
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </section>
  );
};

export default Gallery;
