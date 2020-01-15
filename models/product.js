const fs = require('fs');
const path = require('path');
const utils = require('../utils/utils');

const { mainFolder } = utils;
const p = path.join(mainFolder, 'data', 'products.js');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), error => {
                console.log(error);
            });
        });
    }

    static fetchAll() {
        fs.readFile(p, (err, data) => {
            console.log(JSON.parse(data));
        });
    }
};
