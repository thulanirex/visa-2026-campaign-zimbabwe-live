import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getEligibleCustomers } from './eligibleCustomers';
import { Customer } from './types/Customer';
const customer = (id: number, bank: string): Customer => ({
  id, bank, name: `Entry ${id}`, cardnumber: `${id}`, amount: '100', date: '', statusid: 1,
});
test('each bank can win only once across successive draws', () => {
  const customers = [customer(1, 'FNB'), customer(2, 'FNB'), customer(3, 'Access'), customer(4, 'Access')];
  expect(getEligibleCustomers(customers, [customers[0]], true)).toEqual([customers[2], customers[3]]);
  expect(getEligibleCustomers(customers, [customers[0], customers[2]], true)).toEqual([]);
});
test('normalizes bank names and excludes missing banks', () => {
  const customers = [customer(1, ' access   bank '), customer(2, 'ACCESS BANK'), customer(3, 'FNB'), customer(4, '   ')];
  expect(getEligibleCustomers(customers, [customers[0]], true)).toEqual([customers[2]]);
});
test('excludes winning cards at other banks', () => {
  const winner = customer(1, 'FNB');
  expect(getEligibleCustomers([{ ...customer(2, 'Access'), cardnumber: winner.cardnumber }], [winner], true)).toEqual([]);
});
test('keeps all entries from banks that have not won', () => {
  const customers = [customer(1, 'FNB'), customer(2, 'FNB'), customer(3, 'Access')];
  expect(getEligibleCustomers(customers, [], true)).toEqual(customers);
});

test('allows another winner from any bank when the limit is off, but never repeats a winning card', () => {
  const customers = [customer(1, 'Example Bank'), customer(2, 'Example Bank'), customer(3, 'Another Bank')];
  expect(getEligibleCustomers(customers, [customers[0]], false)).toEqual([customers[1], customers[2]]);
});

test('switching the bank limit on and off uses all existing winners', () => {
  const customers = [customer(1, 'Example Bank'), customer(2, 'Example Bank'), customer(3, 'Example Bank'), customer(4, 'Another Bank')];
  const winners = customers.slice(0, 2);
  expect(getEligibleCustomers(customers, winners, true)).toEqual([customers[3]]);
  expect(getEligibleCustomers(customers, winners, false)).toEqual([customers[2], customers[3]]);
});
test('enforces unique banks at indices 0 to 3 and allows repeat banks starting at index 4', () => {
  const winners = Array.from({ length: 4 }, (_, i) => customer(i + 1, `Bank ${i}`));
  const repeatBank = customer(5, 'Bank 0');
  const newBank = customer(6, 'Bank 4');
  const entries = [...winners, repeatBank, newBank];
  expect(getEligibleCustomers(entries, winners.slice(0, 3), true, 4, 14)).toEqual([winners[3], newBank]);
  expect(getEligibleCustomers(entries, winners, true, 4, 14)).toEqual([repeatBank, newBank]);
});

test('stops at exactly 14 winners', () => {
  const entries = Array.from({ length: 15 }, (_, i) => customer(i + 1, `Bank ${i}`));
  expect(getEligibleCustomers(entries, entries.slice(0, 13), true, 4, 14)).toHaveLength(2);
  expect(getEligibleCustomers(entries, entries.slice(0, 14), true, 4, 14)).toEqual([]);
});

test('all-unique mode stops when banks run out, without silently relaxing the rule', () => {
  const winners = Array.from({ length: 12 }, (_, i) => customer(i + 1, `Bank ${i}`));
  expect(getEligibleCustomers([...winners, customer(13, 'Bank 0')], winners, true, Infinity, 14)).toEqual([]);
});

test('zero unique winners or a disabled bank limit allows repeats from the start', () => {
  const entries = [customer(1, 'Bank A'), customer(2, 'Bank A')];
  expect(getEligibleCustomers(entries, [entries[0]], true, 0, 14)).toEqual([entries[1]]);
  expect(getEligibleCustomers(entries, [entries[0]], false, Infinity, 14)).toEqual([entries[1]]);
});

test('the CSV-backed list supports 10 unique-bank winners followed by 4 unrestricted-bank winners', () => {
  const entries: Customer[] = JSON.parse(readFileSync(resolve(process.cwd(), 'public/responseFinal.json'), 'utf8')).message;
  const winners: Customer[] = [];
  const key = (bank: string) => bank.trim().replace(/\s+/g, ' ').toLowerCase();
  for (let index = 0; index < 14; index++) {
    const eligible = getEligibleCustomers(entries, winners, true, 10, 14);
    expect(eligible.length).toBeGreaterThan(0);
    const previousCards = new Set(winners.map((winner) => winner.cardnumber));
    const previousBanks = new Set(winners.map((winner) => key(winner.bank)));
    expect(eligible.every((entry) => !previousCards.has(entry.cardnumber))).toBe(true);
    if (index < 10) {
      expect(eligible.every((entry) => !previousBanks.has(key(entry.bank)))).toBe(true);
      winners.push(eligible[(index * 97) % eligible.length]);
    } else {
      // Pick from an already winning bank to verify the unrestricted phase is usable.
      const repeatBankEntry = eligible.find((entry) => previousBanks.has(key(entry.bank)));
      expect(repeatBankEntry).toBeDefined();
      winners.push(repeatBankEntry!);
    }
  }
  expect(new Set(winners.slice(0, 10).map((winner) => key(winner.bank))).size).toBe(10);
  expect(new Set(winners.map((winner) => winner.cardnumber)).size).toBe(14);
  expect(getEligibleCustomers(entries, winners, true, 10, 14)).toEqual([]);
});