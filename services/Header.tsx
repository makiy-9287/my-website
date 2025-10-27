import React from 'react';
import { ThreeDotsIcon } from './icons';

interface HeaderProps {
  onMenuClick: (e: React.MouseEvent) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-gray-800 text-white p-3 flex justify-between items-center shadow-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-600">
            <path d="M16.5 7.5h-9v9h9v-9Z" />
            <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 0 1 9 3v.75h6V3a.75.75 0 0 1 1.5 0v.75a3 3 0 0 1 3 3v.75h.75a.75.75 0 0 1 0 1.5H21v6h.75a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75v.75a.75.75 0 0 1-1.5 0v-.75H9v.75a.75.75 0 0 1-1.5 0v-.75a3 3 0 0 1-3-3v-.75H2.25a.75.75 0 0 1 0-1.5H3V9H2.25a.75.75 0 0 1 0-1.5H3v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM15 9H9v6h6V9Z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold">Dhatusena</h1>
          <p className="text-xs text-gray-400">online</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="focus:outline-none">
          <ThreeDotsIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;