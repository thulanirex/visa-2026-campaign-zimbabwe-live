import React from 'react';

// Brand-first animated gradient backdrop aligned to VISA palette
// Blues: #1434CB (Visa Blue), #0A1A4B (Deep Navy), #1B47FF (Accent)
// Gold accent used subtly via overlay sparkles if needed later

const VisaBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Animated gradient layer */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(120deg, #0A1A4B 0%, #1434CB 50%, #1B47FF 100%)',
        backgroundSize: '200% 200%',
        animation: 'visaGradient 14s ease-in-out infinite',
      }} />

      {/* Soft radial highlight to lift the center content */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(60% 50% at 50% 30%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0) 100%)'
      }} />

      {/* Optional subtle moving sheen lines */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)`,
        transform: 'translateZ(0)',
        animation: 'sheen 18s linear infinite',
      }} />

      <style>
        {`
          @keyframes visaGradient { 
            0% { background-position: 0% 0%; } 
            50% { background-position: 100% 100%; } 
            100% { background-position: 0% 0%; } 
          }
          @keyframes sheen { 
            0% { background-position: 0% 0%; }
            100% { background-position: 200% 200%; }
          }
        `}
      </style>
    </div>
  );
};

export default VisaBackdrop;
