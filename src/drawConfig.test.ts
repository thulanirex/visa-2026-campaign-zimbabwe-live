import { getDrawConfig } from './drawConfig';

test('defaults to unique banks throughout and a target of 14', () => {
  expect(getDrawConfig({})).toEqual({ oneWinnerPerBank: true, uniqueBankWinners: Infinity, totalWinners: 14 });
});

test('reads a configurable unique phase and winner target', () => {
  expect(getDrawConfig({ REACT_APP_UNIQUE_BANK_WINNERS: '4', REACT_APP_TOTAL_WINNERS: '14' }).uniqueBankWinners).toBe(4);
  expect(getDrawConfig({ REACT_APP_UNIQUE_BANK_WINNERS: ' ALL ' }).uniqueBankWinners).toBe(Infinity);
  expect(getDrawConfig({ REACT_APP_ONE_WINNER_PER_BANK: 'false' }).oneWinnerPerBank).toBe(false);
});

test.each(['-1', '1.5', 'invalid'])('rejects invalid unique-bank counts: %s', (value) => {
  expect(() => getDrawConfig({ REACT_APP_UNIQUE_BANK_WINNERS: value })).toThrow();
});

test('rejects a zero winner target', () => {
  expect(() => getDrawConfig({ REACT_APP_TOTAL_WINNERS: '0' })).toThrow();
});

test('accepts the 10 unique-bank winners and 14 total winners configuration', () => {
  expect(getDrawConfig({
    REACT_APP_ONE_WINNER_PER_BANK: 'true',
    REACT_APP_UNIQUE_BANK_WINNERS: '10',
    REACT_APP_TOTAL_WINNERS: '14',
  })).toEqual({ oneWinnerPerBank: true, uniqueBankWinners: 10, totalWinners: 14 });
});
