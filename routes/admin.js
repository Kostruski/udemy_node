const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    res.send(`<form action="/product" method="post"><input type="text" name="add-product"/><button type="submit">add product</button></form>`);
    console.log(req.url, 'first use');
});

router.post('/product', (req, res, next) => {
    console.log(req.body, 'body');
    setTimeout(() => {
        res.redirect('/');
    }, 3000);
});

module.exports = router;
