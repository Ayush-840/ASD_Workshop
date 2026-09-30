
const db = require('../database/productsDb');

async function getAllProducts() {
  return db.readAll();
}

async function getProductById(id) {
  const products = await db.readAll();
  return products.find((p) => p.id === id);
}

async function createProduct({ name, price }) {
  const products = await db.readAll();
  const id = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const product = { id, name, price };
  products.push(product);
  await db.writeAll(products);
  return product;
}

async function replaceProduct(id, { name, price }) {
  const products = await db.readAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { id, name, price };
  await db.writeAll(products);
  return products[index];
}

async function updateProduct(id, fields) {
  const products = await db.readAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...fields, id };
  await db.writeAll(products);
  return products[index];
}

async function deleteProduct(id) {
  const products = await db.readAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const [deleted] = products.splice(index, 1);
  await db.writeAll(products);
  return deleted;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
};
