const { ObjectId } = require('mongodb');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProduct = async (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const product = new Product(title, price, imageUrl, description);

    try {
        await product.save();
        res.redirect('/admin/products');
    } catch (error) {
        console.log(error);
    }
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            console.log(product);
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product,
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = async (req, res, next) => {
    const product = new Product(
        req.body.title,
        req.body.price,
        req.body.imageUrl,
        req.body.description,
        new ObjectId(req.body.productId),
    );

    try {
        await product.save();
        res.redirect('/admin/products');
    } catch (error) {
        console.log(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    } catch (error) {
        console.log(error, 'get products');
    }
};

exports.postDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        await Product.deleteProduct(prodId);
        res.redirect('/admin/products');
    } catch (error) {
        console.log('blad usuwanie', error);
    }
};
