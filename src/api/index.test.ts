import { readFileSync } from 'fs';
import { resolve } from 'path';

const originalMode = process.env.REACT_APP_USE_MOCK;
const originalFetch = global.fetch;
const csvData = JSON.parse(readFileSync(resolve(process.cwd(), 'public/responseFinal.json'), 'utf8'));

afterEach(() => {
  if (originalMode === undefined) delete process.env.REACT_APP_USE_MOCK;
  else process.env.REACT_APP_USE_MOCK = originalMode;
  global.fetch = originalFetch;
  jest.restoreAllMocks();
  jest.resetModules();
});

test.each(['true', 'false'])('uses the imported CSV in mock mode %s without fetching API customers', async (mode) => {
  process.env.REACT_APP_USE_MOCK = mode;
  jest.resetModules();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => csvData });
  const { API } = require('./index');
  const entries = await API.fetchCustomersByStatusId(1);
  expect(entries).toEqual(csvData.message);
  expect(entries).toHaveLength(20359);
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith(`${process.env.PUBLIC_URL}/responseFinal.json`, { cache: 'no-store' });
});

test.each(['true', 'false'])('does not substitute sample customers if the CSV data fails in mode %s', async (mode) => {
  process.env.REACT_APP_USE_MOCK = mode;
  jest.resetModules();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
  const { API } = require('./index');
  await expect(API.fetchCustomersByStatusId(1)).rejects.toThrow('404');
});
