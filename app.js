const http = require('http');
const express = require('express');

const app = express();

app.use('/add-product', (req, res, next) => {
    res.send(`<h1>add produkt page ...</h1>`);
    console.log(req.url, 'first use');
});

app.use((req, res, next) => {
    console.log(req.url, 'second use');
    res.send(`<h1>Z ekspresa ....</h1>`);
});

const server = http.createServer(app);

server.listen(3000);
