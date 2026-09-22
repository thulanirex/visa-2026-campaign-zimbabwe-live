import React from 'react';

interface Customer {
  id: number;
  name: string;
  bank: string;
  cardnumber: string;
  amount: string;
  date: string;
  statusid: number;
}

interface Winner extends Customer {
  prize: string;
}

const PastWinners: React.FC<{ winners: Winner[] }> = ({ winners }) => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 mt-8 ring-1 ring-white/10">
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        `}
      </style>
      <h3 className="text-3xl font-extrabold text-white mb-6 text-center tracking-wide">Winners</h3>
      <ul className="space-y-4">
        {winners.map((winner, index) => (
          <li
            key={index}
            className="bg-white/10 hover:bg-white/15 p-4 rounded-xl text-white shadow-md transition duration-300 ring-1 ring-white/10"
            style={{ animation: `fadeIn 500ms ease-out both`, animationDelay: `${index * 80}ms` }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base sm:text-lg items-center">
              <div>
                <span className="inline-block px-2 py-1 rounded-full bg-amber-400/20 text-amber-200 text-sm font-bold mr-2">Draw Number</span>
                <span className="font-semibold">{winner.cardnumber}</span>
              </div>
              <div>
                <span className="inline-block px-2 py-1 rounded-full bg-amber-400/20 text-amber-200 text-sm font-bold mr-2">Bank</span>
                <span className="font-semibold">{winner.bank}</span>
              </div>
              <div>
                <span className="inline-block px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-sm font-bold mr-2">Prize</span>
                <span className="font-semibold">{winner.prize}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PastWinners;
