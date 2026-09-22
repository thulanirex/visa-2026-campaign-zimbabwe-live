import React, { useEffect, useRef, useState } from 'react';

interface PrizeDropdownProps {
  prizes: string[];
  onSelect: (prize: string) => void;
  loading?: boolean;
  disabled?: boolean;
  value?: string;
}

const PrizeDropdown: React.FC<PrizeDropdownProps> = ({
  prizes,
  onSelect,
  loading = false,
  disabled = false,
  value = "",
}) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close on click outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Reset highlight when opening
  useEffect(() => {
    if (open) setHighlighted(Math.max(0, prizes.findIndex((p) => p === value)));
  }, [open, prizes, value]);

  const handleSelect = (prize: string) => {
    onSelect(prize);
    setOpen(false);
  };

  const isDisabled = disabled || loading;

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (isDisabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => (h + 1) % Math.max(1, prizes.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => (h <= 0 ? Math.max(0, prizes.length - 1) : h - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else if (highlighted >= 0 && prizes[highlighted]) {
        handleSelect(prizes[highlighted]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const selectedLabel = value || (loading ? 'Loading prizes…' : 'Select a Prize');

  return (
    <div className="w-full" ref={containerRef}>
      <div className="relative">
        <button
          type="button"
          className={`w-full text-center px-5 py-3 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-60 disabled:cursor-not-allowed 
            ${isDisabled ? 'cursor-not-allowed' : 'hover:bg-white/5'} 
            bg-gradient-to-br from-white/10 to-white/5 text-white border border-white/20 shadow-lg backdrop-blur-md`}
          onClick={() => !isDisabled && setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-disabled={isDisabled}
        >
          <div className="flex items-center justify-between">
            <span className={`${value ? 'text-white' : 'text-white/70'}`}>{selectedLabel}</span>
            {/* chevron */}
            <svg
              className={`ml-3 h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </div>
        </button>

        {/* Dropdown panel */}
        {open && !isDisabled && (
          <div
            className="absolute z-20 mt-2 w-full rounded-xl border border-white/20 bg-[#1434CB]/95 text-white shadow-2xl backdrop-blur-md max-h-60 overflow-auto"
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={highlighted >= 0 ? `prize-${highlighted}` : undefined}
          >
            {prizes.length === 0 && !loading && (
              <div className="px-4 py-3 text-white/70">No prizes available</div>
            )}
            {loading && (
              <div className="px-4 py-3 text-white/70">Loading prizes…</div>
            )}
            {!loading && prizes.map((prize, idx) => {
              const active = idx === highlighted;
              const selected = prize === value;
              return (
                <button
                  id={`prize-${idx}`}
                  key={prize + idx}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setHighlighted(idx)}
                  onClick={() => handleSelect(prize)}
                  className={`w-full text-left px-5 py-3 transition flex items-center gap-3 
                    ${active ? 'bg-white/15' : 'bg-transparent'} 
                    ${selected ? 'text-emerald-200' : 'text-white'}`}
                >
                  {selected && (
                    <svg className="h-4 w-4 text-emerald-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.414 0L3.296 9.466a1 1 0 111.414-1.414l3.046 3.045 6.543-6.543a1 1 0 011.405-.264z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="truncate">{prize}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrizeDropdown;
