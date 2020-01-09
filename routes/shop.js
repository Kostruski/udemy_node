const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
    console.log(req.url, 'second use');
    res.send(`<h1>"Z shop router ...."</h1>`);
});

module.exports = router;
