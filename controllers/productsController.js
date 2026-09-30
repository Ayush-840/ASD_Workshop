
const service = require('../services/productsService');
const { setCache, invalidateCache } = require('../middleware/cache');

function isValidId(value) {
  return /^\d+$/.test(value);
}

function isValidProduct({ name, price }) {
  return (
    typeof name === 'string' &&
    name.trim().length > 0 &&
    typeof price === 'number' &&
    !Number.isNaN(price)
  );
}

async function listProducts(req, res, next) {
  try {
    const products = await service.getAllProducts();
    setCache(req.cacheKey, products);
    res.json(products);
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const product = await service.getProductById(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    setCache(req.cacheKey, product);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, price } = req.body ?? {};
    if (!isValidProduct({ name, price })) {
      return res
        .status(400)
        .json({ error: 'Invalid product: name (string) and price (number) are required' });
    }
    const product = await service.createProduct({ name: name.trim(), price });
    invalidateCache();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function replaceProduct(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const { name, price } = req.body ?? {};
    if (!isValidProduct({ name, price })) {
      return res
        .status(400)
        .json({ error: 'Invalid product: name (string) and price (number) are required' });
    }
    const product = await service.replaceProduct(Number(req.params.id), {
      name: name.trim(),
      price,
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    invalidateCache();
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const fields = {};
    if (req.body?.name !== undefined) {
      if (typeof req.body.name !== 'string' || req.body.name.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid product name' });
      }
      fields.name = req.body.name.trim();
    }
    if (req.body?.price !== undefined) {
      if (typeof req.body.price !== 'number' || Number.isNaN(req.body.price)) {
        return res.status(400).json({ error: 'Invalid product price' });
      }
      fields.price = req.body.price;
    }
    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'Nothing to update: provide name and/or price' });
    }
    const product = await service.updateProduct(Number(req.params.id), fields);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    invalidateCache();
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const deleted = await service.deleteProduct(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    invalidateCache();
    res.json(deleted);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
};
