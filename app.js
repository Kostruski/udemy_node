const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/add-product', (req, res, next) => {
    res.send(`<form action="/product" method="post"><input type="text" name="add-product"/><button type="submit">add product</button></form>`);
    console.log(req.url, 'first use');
});

app.post('/product', (req, res, next) => {
    console.log(req.body, 'body');
    setTimeout(() => {
        res.redirect('/');
    }, 3000);
});

app.use((req, res, next) => {
    console.log(req.url, 'second use');
    res.send(`<h1>"Z ekspresa ...."</h1>`);
});

const server = http.createServer(app);

server.listen(3000);
