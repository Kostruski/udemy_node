// const products = [];

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
    });
};

exports.postAddProduct = (req, res, next) => {
    const addedProduct = new Product(req.body.title);
    addedProduct.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    console.log(Product.fetchAll(), "z get products")

 

    res.render('shop', {
        prods: Product.fetchAll(),
        pageTitle: 'Shop',
        path: '/',
    });
};
