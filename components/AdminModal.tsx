import React, { useState, useEffect } from 'react';
import Button from './Button';
import { saveEventConfig, getEventConfig } from '../services/firebase';
import { VideoConfig } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [day1Url, setDay1Url] = useState('');
  const [day2Url, setDay2Url] = useState('');
  const [status, setStatus] = useState('');

  // Video Management State
  const [videos, setVideos] = useState<VideoConfig[]>([]);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setIsAuthenticated(false);
      setStatus('');
      // Attempt to load current config to pre-fill
      getEventConfig().then(config => {
        if (config) {
          setDay1Url(config.day1FolderUrl || '');
          setDay2Url(config.day2FolderUrl || '');
          setVideos(config.afterMovies || []);
        }
      });
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '150905') {
      setIsAuthenticated(true);
      setStatus('');
    } else {
      setStatus('Password salah, bukan admin ya?');
    }
  };

  const handleAddVideo = () => {
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) {
      setStatus('Isi judul dan link video dulu bos!');
      return;
    }

    const newVideo: VideoConfig = {
      id: Date.now().toString(),
      title: newVideoTitle,
      url: newVideoUrl
    };

    setVideos([...videos, newVideo]);
    setNewVideoTitle('');
    setNewVideoUrl('');
    setStatus('');
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Menyimpan...');
    try {
      await saveEventConfig({
        day1FolderUrl: day1Url,
        day2FolderUrl: day2Url,
        afterMovies: videos
      });
      setStatus('Berhasil disimpan! Refresh halaman buat liat update.');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setStatus('Gagal simpan ke Firebase. Cek console.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border-4 border-black p-6 md:p-8 w-full max-w-2xl shadow-hard-xl relative my-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 font-bold text-xl hover:text-red-600 border-2 border-transparent hover:border-black w-8 h-8 flex items-center justify-center"
        >
          X
        </button>

        <h2 className="font-display text-3xl mb-6 border-b-4 border-black pb-2">ADMIN PANEL</h2>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="font-mono font-bold block mb-2">PASSWORD:</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-black p-3 font-mono focus:outline-none focus:bg-yellow-100"
                placeholder="Masukin kode rahasia"
                autoFocus
              />
            </div>
            <Button type="submit">BUKA PINTU</Button>
            {status && <p className="text-red-500 font-bold font-mono text-sm">{status}</p>}
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Section: Folder Links */}
            <div className="border-b-4 border-black pb-6">
              <h3 className="font-display text-xl mb-4 bg-neo-cyan inline-block px-2 border-2 border-black">KONFIGURASI DRIVE</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-mono font-bold block mb-2 text-sm">LINK FOLDER DRIVE DAY 1:</label>
                  <input 
                    type="text" 
                    value={day1Url}
                    onChange={(e) => setDay1Url(e.target.value)}
                    className="w-full border-2 border-black p-2 font-mono text-sm focus:outline-none focus:bg-cyan-100"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
                <div>
                  <label className="font-mono font-bold block mb-2 text-sm">LINK FOLDER DRIVE DAY 2:</label>
                  <input 
                    type="text" 
                    value={day2Url}
                    onChange={(e) => setDay2Url(e.target.value)}
                    className="w-full border-2 border-black p-2 font-mono text-sm focus:outline-none focus:bg-lime-100"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Section: After Movies */}
            <div className="border-b-4 border-black pb-6">
               <h3 className="font-display text-xl mb-4 bg-neo-pink text-white inline-block px-2 border-2 border-black">AFTER MOVIE (YOUTUBE)</h3>
               
               {/* List Existing Videos */}
               {videos.length > 0 && (
                 <div className="mb-4 flex flex-col gap-2">
                   {videos.map((video, idx) => (
                     <div key={video.id} className="flex items-center justify-between bg-gray-100 p-2 border-2 border-black">
                       <div className="truncate pr-2">
                         <span className="font-mono font-bold mr-2 text-xs bg-black text-white px-1">#{idx + 1}</span>
                         <span className="font-mono text-sm">{video.title}</span>
                       </div>
                       <button 
                        onClick={() => handleDeleteVideo(video.id)}
                        className="bg-red-500 text-white text-xs font-bold px-2 py-1 border-2 border-black hover:bg-red-600"
                       >
                         HAPUS
                       </button>
                     </div>
                   ))}
                 </div>
               )}

               {/* Add New Video Form */}
               <div className="bg-neo-yellow/30 p-4 border-2 border-black border-dashed">
                 <h4 className="font-mono font-bold text-sm mb-2">TAMBAH VIDEO BARU:</h4>
                 <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      className="w-full border-2 border-black p-2 font-mono text-sm"
                      placeholder="Judul Video (misal: Day 1 Recap)"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        className="w-full border-2 border-black p-2 font-mono text-sm"
                        placeholder="Link Youtube (https://...)"
                      />
                      <button 
                        onClick={handleAddVideo}
                        className="bg-neo-lime font-bold border-2 border-black px-4 hover:bg-lime-400 whitespace-nowrap"
                      >
                        + ADD
                      </button>
                    </div>
                 </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
               <Button onClick={handleSave} variant="primary" className="w-full py-3 text-lg">
                 SIMPAN SEMUA PERUBAHAN
               </Button>
               {status && <p className={`font-bold font-mono text-center text-sm ${status.includes('Berhasil') ? 'text-green-600' : 'text-blue-600'}`}>{status}</p>}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModal;