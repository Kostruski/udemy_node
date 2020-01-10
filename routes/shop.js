const express = require('express');
const path = require('path');
const router = express.Router();
const dirPath = require('../utils/path')

router.get('/', (req, res, next) => {
    console.log(req.url, 'second use');
    res.sendFile(path.join(dirPath, 'views', 'shop.html'));
});

module.exports = router;
