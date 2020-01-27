const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title } = req.body;
    const { imageUrl } = req.body;
    const { price } = req.body;
    const { description } = req.body;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
};
