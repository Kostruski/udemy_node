const express = require('express');

const router = express.Router();
const path = require('path');
const dirPath = require('../utils/path');

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(dirPath, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res, next) => {
    console.log(req.body, 'body');
    res.redirect('/');
});

module.exports = router;
