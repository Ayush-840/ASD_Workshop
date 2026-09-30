
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');
const SIMULATED_DELAY_MS = parseInt(process.env.SIMULATED_DELAY_MS, 10) || 1500;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readAll() {
  await delay(SIMULATED_DELAY_MS);
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeAll(products) {
  await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2) + '\n', 'utf-8');
  return products;
}

module.exports = { readAll, writeAll };
