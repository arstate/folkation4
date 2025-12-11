import React, { useEffect } from 'react';
import { getHighResImageUrl } from '../services/googleDrive';
import { DriveFile } from '../types';

interface PhotoModalProps {
  photo: DriveFile | null;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neo-black/90 p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative bg-white border-4 border-black p-2 md:p-4 max-w-5xl w-full max-h-[90vh] flex flex-col shadow-hard-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <button 
          onClick={onClose}
          className="absolute -top-6 -right-6 md:-top-8 md:-right-8 bg-neo-pink text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-bold text-2xl border-4 border-black hover:scale-110 transition-transform shadow-hard"
        >
          X
        </button>

        <div className="flex-1 overflow-hidden flex items-center justify-center bg-gray-100 border-2 border-black">
          <img 
            src={getHighResImageUrl(photo.thumbnailLink)} 
            alt={photo.name} 
            className="max-w-full max-h-[75vh] object-contain"
          />
        </div>

        <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-mono text-sm md:text-base font-bold truncate max-w-[200px]">{photo.name}</span>
            <a 
              href={photo.webContentLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-neo-cyan font-mono font-bold px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-hover active:translate-y-1 active:shadow-none text-center w-full md:w-auto"
            >
              DOWNLOAD HD
            </a>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
