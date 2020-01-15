const path = require('path');
const express = require('express');
const productsControler = require('../controllers/products');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', productsControler.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', productsControler.postAddProduct);

module.exports = router;

