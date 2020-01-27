const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json',
);

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl =
            imageUrl === ''
                ? 'https://www.publicdomainpictures.net/pictures/10000/velka/1-1210009435EGmE.jpg'
                : imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            cb(product);
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const filteredProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(filteredProducts), err => {
                console.log(err);
            });
        });
    }
};
