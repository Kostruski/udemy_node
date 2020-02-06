const { ObjectId } = require('mongodb');
const Product = require('../models/product');
const User = require('../models/user');
const { getDb } = require('../util/database');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getProduct = async (req, res, next) => {
    const prodId = req.params.productId;

    try {
        const product = await Product.findById(prodId);
        res.render('shop/product-detail', {
            product,
            pageTitle: product.title,
            path: '/products',
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getIndex = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const products = await req.user.getCart();
        res.render('shop/cart', {
            path: '/shop',
            pageTitle: 'Cart',
            products,
        });
    } catch (error) {
        console.log('nie wyswietlony koszyk', error);
    }
};

exports.postCart = async (req, res, next) => {
    const id = req.body.productId;
    const user = req.user;
    try {
        await user.addToCart(id);
        res.redirect('/cart');
    } catch (error) {
        console.log('nie dodano do koszyka', error);
    }
};

exports.postCartDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    const user = req.user;
    try {
        await user.removeFromCart(prodId);
        res.redirect('/cart');
    } catch (error) {
        console.log('blad suswania z koszyka', error);
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        await req.user.addOrder();
        res.redirect('/orders');
    } catch (error) {
        console.log('dodanie do zam', error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await req.user.getOrders();
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders,
        });
    } catch (error) {
        console.log('blad pobierania zamowien', error);
    }
};
