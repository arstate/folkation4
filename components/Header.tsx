import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/day1', label: 'DAY 1' },
    { path: '/day2', label: 'DAY 2' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-neo-white border-b-4 border-black px-4 py-3 flex justify-between items-center">
      <Link 
        to="/"
        className="font-display text-2xl md:text-3xl tracking-tighter italic cursor-pointer select-none"
      >
        FOLKATION<span className="text-neo-pink">4.0</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              font-mono font-bold px-4 py-1 border-2 border-black transition-all
              ${isActive(item.path) 
                ? 'bg-neo-lime shadow-hard -translate-y-1' 
                : 'bg-white hover:bg-gray-100'
              }
            `}
          >
            {item.label}
          </Link>
        ))}
        {/* Video Link (Uses Link for HashRouter compatibility) */}
        <Link 
            to="/#video"
            className="font-mono font-bold px-4 py-1 border-2 border-black transition-all bg-white hover:bg-gray-100"
        >
            VIDEO
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="border-2 border-black p-2 bg-neo-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-neo-white border-b-4 border-black p-4 flex flex-col gap-3 shadow-hard-xl animate-in slide-in-from-top-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`
                w-full text-left font-mono font-bold text-xl px-4 py-3 border-2 border-black
                ${isActive(item.path) ? 'bg-neo-lime' : 'bg-white'}
              `}
            >
              {item.label}
            </Link>
          ))}
           <Link
              to="/#video"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-left font-mono font-bold text-xl px-4 py-3 border-2 border-black bg-white"
            >
              VIDEO
            </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;