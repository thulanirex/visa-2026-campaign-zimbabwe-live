import React from 'react';

interface DrawButtonProps {
  onStartDraw: () => void;
  disabled?: boolean;
}

const DrawButton: React.FC<DrawButtonProps> = ({ onStartDraw, disabled = false }) => {
  return (
    <button
      className={`relative overflow-hidden text-white text-lg font-extrabold py-6 px-6 rounded-full shadow-xl transition duration-300 transform focus:outline-none focus:ring-4 focus:ring-white/60 text-center items-center ring-2 ring-white/20 ${disabled ? 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 opacity-60 cursor-not-allowed' : 'bg-gradient-to-br from-[#1b47ff] via-[#1434CB] to-[#0c2188] hover:scale-105 hover:ring-white/40'}`}
      onClick={onStartDraw}
      disabled={disabled}
      style={{
        width: '140px',
        height: '160px',
        borderRadius: '90px',
      }}
    >
      <span className="absolute inset-0 bg-white/10 blur-2xl opacity-0 hover:opacity-20 transition-opacity" />
      START DRAW
    </button>
  );
};

export default DrawButton;
