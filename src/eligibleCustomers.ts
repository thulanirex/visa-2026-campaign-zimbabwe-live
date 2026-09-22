import { Customer } from './types/Customer';

const bankKey = (bank: string) => (bank || '').trim().replace(/\s+/g, ' ').toLowerCase();

export const getEligibleCustomers = (customers: Customer[], winners: Customer[], oneWinnerPerBank: boolean, uniqueBankWinners = Infinity, totalWinners = Infinity): Customer[] => {
  if (winners.length >= totalWinners) return [];
  const restrictBanks = oneWinnerPerBank && winners.length < uniqueBankWinners;
  const winningBanks = new Set(winners.map((winner) => bankKey(winner.bank)));
  const winningCards = new Set(winners.map((winner) => winner.cardnumber));
  return customers.filter((customer) => {
    const bank = bankKey(customer.bank);
    return (!restrictBanks || (Boolean(bank) && !winningBanks.has(bank))) && !winningCards.has(customer.cardnumber);
  });
};
