import React from 'react';

interface DropdownMenuProps {
  onContactClick: () => void;
  onAboutClick: () => void;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onContactClick, onAboutClick, onClose }) => {
  return (
    <div className="absolute top-12 right-2 w-48 bg-gray-700 rounded-md shadow-lg z-20 py-1">
      <button
        onClick={() => { onContactClick(); onClose(); }}
        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
      >
        Contact via WhatsApp
      </button>
      <button
        onClick={() => { onAboutClick(); onClose(); }}
        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
      >
        About
      </button>
    </div>
  );
};

export default DropdownMenu;