import React, { useState, useEffect } from 'react';
import { DriveFile, TabType, EventConfig } from '../types';
import { fetchDriveFiles, extractFolderId } from '../services/googleDrive';
import { getEventConfig } from '../services/firebase';
import Button from './Button';
import PhotoModal from './PhotoModal';
import { Link } from 'react-router-dom';

interface GalleryProps {
  day: 'day1' | 'day2';
}

const Gallery: React.FC<GalleryProps> = ({ day }) => {
  const [photos, setPhotos] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<DriveFile | null>(null);
  
  // Folder Navigation State
  const [rootFolderId, setRootFolderId] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderHistory, setFolderHistory] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    getEventConfig().then((data) => {
      if (data) setConfig(data);
    });
  }, []);

  // Initialize Root Folder
  useEffect(() => {
    if (!config) return;
    const url = day === 'day1' ? config.day1FolderUrl : config.day2FolderUrl;
    const id = extractFolderId(url);
    setRootFolderId(id);
    setCurrentFolderId(id);
    setFolderHistory([]); // Reset history when day changes
  }, [config, day]);

  // Fetch photos when currentFolderId changes
  useEffect(() => {
    const loadPhotos = async () => {
      if (!currentFolderId) return;

      setLoading(true);
      setError(null);
      setPhotos([]);

      try {
        const files = await fetchDriveFiles(currentFolderId);
        setPhotos(files);
      } catch (err) {
        setError("Gagal ambil data. Folder mungkin diprivate atau limit API tercapai.");
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [currentFolderId]);

  const handleFolderClick = (folder: DriveFile) => {
    setFolderHistory([...folderHistory, { id: currentFolderId!, name: folder.name }]);
    setCurrentFolderId(folder.id);
  };

  const handleBack = () => {
    if (folderHistory.length === 0) return;
    const previous = folderHistory[folderHistory.length - 1];
    setFolderHistory(folderHistory.slice(0, -1));
    setCurrentFolderId(previous.id);
  };

  const cardColors = ['bg-white', 'bg-neo-cyan', 'bg-neo-lime', 'bg-neo-pink', 'bg-neo-yellow'];

  return (
    <section className="py-12 px-4 md:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
           <Link to="/">
             <Button variant="secondary" className="text-sm">
               ← KEMBALI KE HOME
             </Button>
           </Link>
           
           <h2 className="font-display text-4xl md:text-6xl text-center text-stroke-black">
             GALERI <span className={day === 'day1' ? 'text-neo-yellow' : 'text-neo-cyan'}>
               {day === 'day1' ? 'DAY 01' : 'DAY 02'}
             </span>
           </h2>
           
           <div className="w-[180px] hidden md:block"></div> {/* Spacer for alignment */}
        </div>

        {/* Breadcrumb / Navigation */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2">
            {folderHistory.length > 0 && (
              <Button onClick={handleBack} variant="secondary" className="py-1 px-3 text-sm mr-2">
                ⬆ NAIK FOLDER
              </Button>
            )}
            <span className="font-mono font-bold">
              PATH: /{day}
              {folderHistory.map((h, i) => (
                <span key={i} className="text-gray-500"> / {h.name}</span>
              ))}
            </span>
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
              <p className="font-mono font-bold text-2xl text-gray-400">ZONK! KOSONG.</p>
            </div>
          )}

          {!loading && !error && photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {photos.map((file, index) => {
                const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                const isLarge = !isFolder && index % 7 === 0;
                const rotate = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
                const color = isFolder ? 'bg-neo-yellow' : cardColors[index % cardColors.length];
                
                if (isFolder) {
                    return (
                        <div 
                            key={file.id}
                            onClick={() => handleFolderClick(file)}
                            className={`
                                group cursor-pointer border-4 border-black p-4 transition-all duration-300
                                hover:scale-105 hover:z-10 shadow-hard hover:shadow-hard-xl
                                bg-neo-white flex flex-col justify-center items-center text-center aspect-square
                            `}
                        >
                            <div className="text-6xl mb-2">📁</div>
                            <span className="font-mono font-bold text-sm md:text-lg break-words w-full line-clamp-2">
                                {file.name}
                            </span>
                        </div>
                    )
                }

                return (
                  <div 
                    key={file.id}
                    onClick={() => setSelectedPhoto(file)}
                    className={`
                      group relative cursor-pointer border-4 border-black p-2 transition-all duration-300
                      hover:scale-105 hover:z-10 shadow-hard hover:shadow-hard-xl
                      ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
                      ${rotate}
                      ${color}
                    `}
                  >
                    <div className="overflow-hidden border-2 border-black h-full w-full bg-gray-200 relative">
                      <img 
                        src={file.thumbnailLink?.replace('=s220', '=s600')} 
                        alt={file.name}
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