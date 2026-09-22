import { Customer } from '../types/Customer';

export interface Prize { prizeid: number; prize: string }

// Fallback customers if entries.txt fails to load
const fallbackCustomers: Customer[] = [
  {
    id: 1,
    name: 'BID-1001',
    bank: 'Standard Bank',
    cardnumber: '4111111111111111',
    amount: '1500',
    date: '2024-11-20',
    statusid: 2,
  },
  {
    id: 2,
    name: 'BID-1002',
    bank: 'Nedbank',
    cardnumber: '5500000000000004',
    amount: '2300',
    date: '2024-11-21',
    statusid: 2,
  },
  {
    id: 3,
    name: 'BID-1003',
    bank: 'ABSA',
    cardnumber: '4000000000003220',
    amount: '980',
    date: '2024-11-22',
    statusid: 2,
  },
  {
    id: 4,
    name: 'BID-1004',
    bank: 'FNB',
    cardnumber: '4000000000009995',
    amount: '3200',
    date: '2024-11-23',
    statusid: 2,
  },
];

// Async function to load and parse entries from responseFinal.json
export const loadEntriesFromFile = async (): Promise<Customer[]> => {
  try {
    console.log('🔄 Loading entries from /responseFinal.json...');
    const response = await fetch(`${process.env.PUBLIC_URL}/responseFinal.json`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Raw response:', { statusCode: data.statusCode, messageLength: data.message?.length });
    
    // Handle the API wrapper structure: { statusCode: 200, message: [...] }
    let entries: any[] = [];
    
    if (data.statusCode === 200 && Array.isArray(data.message)) {
      entries = data.message;
    } else if (Array.isArray(data)) {
      entries = data;
    } else {
      throw new Error('Unexpected JSON structure');
    }
    
    // The data is already in the correct Customer format from the database
    const loadedCustomers: Customer[] = entries.map((entry: any) => ({
      id: entry.id,
      name: entry.name,
      bank: entry.bank,
      cardnumber: entry.cardnumber,
      amount: entry.amount?.toString() || '0',
      date: entry.date,
      statusid: entry.statusid || 2,
    }));
    
    console.log(`✅ Successfully loaded ${loadedCustomers.length} entries from responseFinal.json`);
    return loadedCustomers;
  } catch (err) {
    console.error('❌ Failed to load responseFinal.json:', err);
    throw err;
  }
};

// For backward compatibility
export const mockCustomers: Customer[] = fallbackCustomers;

export const mockPrizes: Prize[] = [
  { prizeid: 1, prize: 'TotalEnergies CAF AFCON' },
];
