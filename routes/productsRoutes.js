
const express = require('express');
const { cacheMiddleware } = require('../middleware/cache');
const controller = require('../controllers/productsController');

const router = express.Router();

router.get('/', cacheMiddleware(() => 'products'), controller.listProducts);
router.get('/:id', cacheMiddleware((req) => `product:${req.params.id}`), controller.getProduct);
router.post('/', controller.createProduct);
router.put('/:id', controller.replaceProduct);
router.patch('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

module.exports = router;
