const readCount = (value: string | undefined, fallback: number, name: string, minimum: number): number => {
  if (value === undefined || value.trim() === '') return fallback;
  const text = value.trim();
  const count = Number(text);
  if (!/^\d+$/.test(text) || !Number.isSafeInteger(count) || count < minimum) {
    throw new Error(`${name} must be a whole number of at least ${minimum}.`);
  }
  return count;
};

export const getDrawConfig = (env: {
  REACT_APP_ONE_WINNER_PER_BANK?: string;
  REACT_APP_UNIQUE_BANK_WINNERS?: string;
  REACT_APP_TOTAL_WINNERS?: string;
}) => ({
  oneWinnerPerBank: (env.REACT_APP_ONE_WINNER_PER_BANK ?? 'true').trim().toLowerCase() !== 'false',
  uniqueBankWinners: (env.REACT_APP_UNIQUE_BANK_WINNERS ?? 'all').trim().toLowerCase() === 'all'
    ? Infinity
    : readCount(env.REACT_APP_UNIQUE_BANK_WINNERS, Infinity, 'REACT_APP_UNIQUE_BANK_WINNERS', 0),
  totalWinners: readCount(env.REACT_APP_TOTAL_WINNERS, 14, 'REACT_APP_TOTAL_WINNERS', 1),
});
