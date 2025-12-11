import React, { useState, useEffect } from 'react';
import Button from './Button';
import { saveEventConfig, getEventConfig } from '../services/firebase';

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

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setIsAuthenticated(false);
      setStatus('');
      // Attempt to load current config to pre-fill
      getEventConfig().then(config => {
        if (config) {
          setDay1Url(config.day1FolderUrl);
          setDay2Url(config.day2FolderUrl);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Menyimpan...');
    try {
      await saveEventConfig({
        day1FolderUrl: day1Url,
        day2FolderUrl: day2Url
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white border-4 border-black p-6 md:p-8 w-full max-w-md shadow-hard-xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 font-bold text-xl hover:text-red-600"
        >
          X
        </button>

        <h2 className="font-display text-3xl mb-6">ADMIN PANEL</h2>

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
          <form onSubmit={handleSave} className="flex flex-col gap-4">
             <div>
              <label className="font-mono font-bold block mb-2">LINK FOLDER DRIVE DAY 1:</label>
              <input 
                type="text" 
                value={day1Url}
                onChange={(e) => setDay1Url(e.target.value)}
                className="w-full border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-cyan-100"
                placeholder="Paste link folder disini..."
              />
            </div>
             <div>
              <label className="font-mono font-bold block mb-2">LINK FOLDER DRIVE DAY 2:</label>
              <input 
                type="text" 
                value={day2Url}
                onChange={(e) => setDay2Url(e.target.value)}
                className="w-full border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-lime-100"
                placeholder="Paste link folder disini..."
              />
            </div>
            <div className="text-xs font-mono bg-gray-100 p-2 border border-black">
              *Pastikan folder di Google Drive settingnya "Anyone with the link can view".
            </div>
            <Button type="submit" variant="accent">SIMPAN KONFIGURASI</Button>
            {status && <p className={`font-bold font-mono text-sm ${status.includes('Berhasil') ? 'text-green-600' : 'text-blue-600'}`}>{status}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminModal;
