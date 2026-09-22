import { Customer } from '../types/Customer';
import { mockCustomers, mockPrizes, loadEntriesFromFile } from '../data/mock';

export interface Prize { prizeid: number; prize: string }

// Default to mock mode (true) unless explicitly set to 'false'
const USE_MOCK = (process.env.REACT_APP_USE_MOCK || 'true').toLowerCase() === 'true';
export const IS_MOCK_MODE = USE_MOCK;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Real endpoints
const REAL = {
  async fetchCustomersByStatusId(statusId: number): Promise<Customer[]> {
    try {
      const resp = await fetch(`http://localhost:3176/BankingDraw/fetchCustomersByStatus/${statusId}`);
      const data = await resp.json();
      if (data.statusCode === 200) return data.message as Customer[];
      throw new Error('Failed to fetch customers');
    } catch (err) {
      console.warn('[API] Falling back to mock customers due to error:', err);
      return mockCustomers;
    }
  },
  async fetchPrizes(): Promise<Prize[]> {
    try {
      const resp = await fetch('http://localhost:3176/BankingDraw/fetchPrizes');
      const data = await resp.json();
      if (data.statusCode === 200) return data.message as Prize[];
      throw new Error('Failed to fetch prizes');
    } catch (err) {
      console.warn('[API] Falling back to mock prizes due to error:', err);
      return mockPrizes;
    }
  },
  async postWinner(winner: Customer, prizeId: number): Promise<void> {
    const resp = await fetch('http://localhost:3176/BankingDraw/winner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        winner: { ...winner, prizeid: prizeId },
      }),
    });
    const data = await resp.json();
    if (!resp.ok || data.statusCode !== 200) {
      throw new Error(data.message || 'Failed to save winner');
    }
  },
  async updateCustomerStatus(_customerId: number): Promise<void> {
    try {
      const resp = await fetch(
        `http://localhost:3176/BankingDraw/updateCustomerStatus/statusid/2/customerid/${_customerId}`,
        { method: 'GET' }
      );
      const data = await resp.json();
      if (data.statusCode !== 200) throw new Error('Failed to update status');
    } catch (err) {
      console.warn('[API] updateCustomerStatus failed; ignoring in mock-friendly mode:', err);
      // No-op in fallback
    }
  },
};

// Mock endpoints
const MOCK = {
  async fetchCustomersByStatusId(_statusId: number): Promise<Customer[]> {
    await delay(500);
    return loadEntriesFromFile();
  },
  async fetchPrizes(): Promise<Prize[]> {
    await delay(300);
    return mockPrizes;
  },
  async postWinner(_winner: Customer, _prizeId: number): Promise<void> {
    await delay(200);
    // no-op
  },
  async updateCustomerStatus(_customerId: number): Promise<void> {
    await delay(150);
    // no-op
  },
};

export const API = USE_MOCK ? MOCK : REAL;
