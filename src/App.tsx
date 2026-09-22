import React, { useState, useEffect } from "react";
import PrizeDropdown from "./components/PrizeDropedown";
import DrawButton from "./components/DrawButton";
import WinnerAnimation from "./components/WinnerAnimation";
import PastWinners from "./components/PastWinners";
import visaLogo from "./assets/visa-logo.png";
import { API, IS_MOCK_MODE } from "./api";
import BackgroundSlideshow from "./components/BackgroundSlideshow";
import { getEligibleCustomers } from "./eligibleCustomers";
import { getDrawConfig } from "./drawConfig";

const capeTownImageBase = `${process.env.PUBLIC_URL}/Cape Town Image/Cape Town Image`;
const campaignImages = [
  `${capeTownImageBase}/aerial-coastal-view-of-cape-town-south-africa-2026-03-09-04-07-32-utc (1).jpg`,
  `${capeTownImageBase}/aerial-view-of-cape-town-south-africa-2026-03-09-04-08-23-utc.jpg`,
  `${capeTownImageBase}/camps-bay-cape-town-camps-bay-beach-drone-aerial-2026-03-16-04-26-20-utc.jpg`,
  `${capeTownImageBase}/city-of-cape-town-south-africa-2026-03-09-04-08-34-utc.jpg`,
];
const capeTownLogo = `${process.env.PUBLIC_URL}/Capetown Logo/Capetown Logo/logo.png`;

interface Customer {
  id: number;
  name: string;
  bank: string;
  cardnumber: string;
  amount: string;
  date: string;
  statusid: number;
}

interface Prize {
  prizeid: number;
  prize: string;
}

const HARDCODED_PRIZE: Prize = {
  prizeid: 0,
  prize: "Cape Town Experience",
};

const prizes: Prize[] = [HARDCODED_PRIZE];
const DRAW_DURATION_MS = 15_000;
const { oneWinnerPerBank, uniqueBankWinners, totalWinners } = getDrawConfig({
  REACT_APP_ONE_WINNER_PER_BANK: process.env.REACT_APP_ONE_WINNER_PER_BANK,
  REACT_APP_UNIQUE_BANK_WINNERS: process.env.REACT_APP_UNIQUE_BANK_WINNERS,
  REACT_APP_TOTAL_WINNERS: process.env.REACT_APP_TOTAL_WINNERS,
});

const App: React.FC = () => {
  const [selectedPrize, setSelectedPrize] = useState<string>(HARDCODED_PRIZE.prize);
  const [winner, setWinner] = useState<Customer | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pastWinners, setPastWinners] = useState<
    Array<Customer & { prize: string }>
  >([]);

  const availableCustomers = getEligibleCustomers(customers, pastWinners, oneWinnerPerBank, uniqueBankWinners, totalWinners);

  useEffect(() => {
    const fetchCustomersByStatusId = async () => {
      try {
        const data = await API.fetchCustomersByStatusId(1);
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers by status id:", error);
      }
    };

    fetchCustomersByStatusId();
  }, []);

  const sendWinnerToServer = async (winner: Customer, prizeId: number) => {
    try {
      await API.postWinner(winner, prizeId);
      console.log("Winner saved successfully");
      return true;
    } catch (error) {
      console.error("Error posting winner to server:", error);
      return false;
    }
  };

  const updateCustomerStatus = async (customerId: number) => {
    try {
      await API.updateCustomerStatus(customerId);
      console.log("Customer status updated successfully");
    } catch (error) {
      console.error("Error updating customer status:", error);
    }
  };

  const handleStartDraw = () => {
    if (isDrawing || !selectedPrize || availableCustomers.length === 0) return;

    setIsDrawing(true);
    setWinner(null);

    setTimeout(async () => {
      const randomWinner =
        availableCustomers[
          Math.floor(Math.random() * availableCustomers.length)
        ];

      const selectedPrizeObj = prizes.find(
        (prize) => prize.prize === selectedPrize
      );
      const prizeId = selectedPrizeObj?.prizeid;

      if (selectedPrizeObj) {
        const newWinner = {
          ...randomWinner,
          prize: selectedPrize,
        };

        setPastWinners((prevWinners) => [...prevWinners, newWinner]);
        setWinner(randomWinner);

        const winnerSaved = await sendWinnerToServer(
          randomWinner,
          prizeId ?? HARDCODED_PRIZE.prizeid
        );
        if (winnerSaved) {
          await updateCustomerStatus(randomWinner.id);
        }
      } else {
        console.error("Selected prize not found in the fetched prize list.");
      }

      setIsDrawing(false);
    }, DRAW_DURATION_MS);
  };

  return (
    <div className="relative min-h-screen overflow-hidden p-6 sm:p-8">
      <BackgroundSlideshow images={campaignImages} />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#061344]/45 via-[#1434CB]/35 to-[#07123a]/48 pointer-events-none" />

      {/* Content wrapper to keep everything above overlay */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 border-b border-white/20 pb-4">
          <img src={visaLogo} alt="Visa Logo" className="h-10 sm:h-12 object-contain" />
          <div className="text-center">
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide">
              OFFICIAL WINNER DRAW &ndash; ZIMBABWE
            </h1>
            <h2 className="text-white/90 text-lg sm:text-xl md:text-2xl font-semibold mt-1">
              Visa Cross Border &quot;We Accept&quot; Cape Town Experience Campaign
            </h2>
            {IS_MOCK_MODE && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold border border-amber-300/30">
                Mock Mode
              </div>
            )}
          </div>
          <img
            src={capeTownLogo}
            alt="Cape Town campaign logo"
            className="h-16 sm:h-20 w-28 sm:w-36 object-contain brightness-0 invert"
          />
        </header>

        {/* Controls Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start mb-10">
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-full max-w-md">
              <PrizeDropdown
                prizes={prizes.map((p) => p.prize)}
                onSelect={setSelectedPrize}
                value={selectedPrize}
                loading={false}
                disabled={isDrawing}
              />
              <div className="mt-2 text-sm">
                <span className="text-emerald-200">Prize ready</span>
              </div>
            </div>
            <div className="mt-6">
              <DrawButton onStartDraw={handleStartDraw} disabled={!selectedPrize || isDrawing || availableCustomers.length === 0} />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <WinnerAnimation
              customers={availableCustomers}
              winner={winner}
              prize={selectedPrize}
              isDrawing={isDrawing}
              drawDurationMs={DRAW_DURATION_MS}
            />
          </div>
        </section>

        {/* Removed photo decorative layer to keep pure Visa brand look */}

        {/* Winners List */}
        <section>
          {customers.length > 0 ? (
            <PastWinners winners={pastWinners} />
          ) : (
            <p className="text-white/90">No customers available</p>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-white/80 py-4 border-t border-white/20">
          VERIFIED BY INDEPENDENT AUDITORS
        </footer>
      </div>
    </div>
  );
};

export default App;
