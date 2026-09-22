import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface Customer {
  id: number;
  name: string;
  bank: string;
  cardnumber: string;
  amount: string;
  date: string;
  statusid: number;
}

interface WinnerAnimationProps {
  customers: Customer[];
  winner: Customer | null;
  prize: string;
  isDrawing: boolean;
  drawDurationMs?: number;
}

const maskCardNumber = (cardNumber: string) =>
  `${cardNumber.slice(0, 4)} **** **** ${cardNumber.slice(-4)}`;

const WinnerAnimation: React.FC<WinnerAnimationProps> = ({
  customers,
  winner,
  prize,
  isDrawing,
  drawDurationMs = 15_000,
}) => {
  const totalSeconds = Math.ceil(drawDurationMs / 1000);
  const [current, setCurrent] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (!isDrawing || customers.length === 0) return;

    const shuffleTimer = window.setInterval(() => {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      if (randomCustomer?.cardnumber) {
        setCurrent(maskCardNumber(randomCustomer.cardnumber));
      }
    }, 100);

    return () => window.clearInterval(shuffleTimer);
  }, [isDrawing, customers]);

  useEffect(() => {
    if (!isDrawing) {
      setSecondsRemaining(totalSeconds);
      return;
    }

    const startedAt = Date.now();
    setSecondsRemaining(totalSeconds);

    const countdownTimer = window.setInterval(() => {
      const elapsedMs = Date.now() - startedAt;
      const remaining = Math.max(0, Math.ceil((drawDurationMs - elapsedMs) / 1000));
      setSecondsRemaining(remaining);
    }, 200);

    return () => window.clearInterval(countdownTimer);
  }, [isDrawing, drawDurationMs, totalSeconds]);

  const elapsedPercent = Math.min(
    100,
    ((totalSeconds - secondsRemaining) / totalSeconds) * 100
  );
  const remainingDegrees = (secondsRemaining / totalSeconds) * 360;

  return (
    <div className="relative w-full max-w-md lg:left-[10px] lg:top-[5px]">
      {winner && <Confetti />}

      <div className="backdrop-blur-xl bg-white/15 border border-white/25 rounded-2xl shadow-2xl p-6 text-center ring-1 ring-white/10">
        <style>
          {`
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes pulseSoft { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
            .animate-fadeInUp { animation: fadeInUp 600ms ease-out both; }
            .countdown-pulse { animation: pulseSoft 1s ease-in-out infinite; }
            .glow { box-shadow: 0 10px 30px rgba(20,52,203,0.3), inset 0 0 30px rgba(255,255,255,0.06); }
            .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent); }
            @media (prefers-reduced-motion: reduce) { .countdown-pulse { animation: none; } }
          `}
        </style>

        {winner ? (
          <div className="animate-fadeInUp">
            <h3 className="text-2xl font-extrabold text-white tracking-wide mb-3 glow">Winner Details</h3>
            <div className="divider mb-4" />
            <div className="space-y-2 text-white/95">
              <p className="font-semibold"><span className="text-amber-300">Draw Number:</span> {winner.cardnumber}</p>
              <p className="font-semibold"><span className="text-amber-300">Bank:</span> {winner.bank}</p>
              <p className="font-semibold"><span className="text-amber-300">Prize:</span> {prize}</p>
            </div>
          </div>
        ) : isDrawing ? (
          <div className="animate-fadeInUp" aria-live="polite">
            <h3 className="text-2xl font-extrabold text-white mb-3">Selecting Winner...</h3>
            <div className="divider mb-5" />
            <div className="flex flex-col items-center gap-4">
              <div
                className="countdown-pulse flex h-24 w-24 items-center justify-center rounded-full p-[5px] shadow-[0_0_30px_rgba(251,191,36,0.35)]"
                style={{
                  background: `conic-gradient(#fbbf24 ${remainingDegrees}deg, rgba(255,255,255,0.18) ${remainingDegrees}deg)`,
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#102974]/95 text-white">
                  <span className="text-4xl font-black leading-none">{secondsRemaining}</span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/70">seconds</span>
                </div>
              </div>

              <p className="text-sm font-semibold uppercase tracking-widest text-amber-200">
                Winner reveal in
              </p>

              <div className="w-full overflow-hidden rounded-full bg-white/15 h-2" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 transition-[width] duration-200 ease-linear"
                  style={{ width: `${elapsedPercent}%` }}
                />
              </div>

              <div className="min-w-[250px] rounded-lg bg-white/10 px-4 py-2 text-lg text-white/90">
                {current || 'Shuffling entries...'}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <h3 className="text-2xl font-extrabold text-white mb-3">Draw not running yet</h3>
            <div className="divider" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnerAnimation;
