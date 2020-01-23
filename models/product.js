const fs = require('fs');
const path = require('path');
const utils = require('../utils/utils');

const { mainFolder } = utils;
const p = path.join(mainFolder, 'data', 'products.js');

const fileContent = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(p, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
};

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    async save() {
        let products = [];
        try {
            const productsFromFile = await fileContent();
            const productsParsed = await JSON.parse(productsFromFile);
            products = productsParsed;
        } catch (error) {
            console.log('error in reading products from file', error);
        }
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), error => {
            console.log(error);
        });
    }

    static fetchAll() {
        return fileContent();
    }
};
