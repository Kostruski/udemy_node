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

exports.getProducts = async (req, res, next) => {
  let products = [];
  try {
    const fileContent = await Product.fetchAll();
    products = await JSON.parse(fileContent);
  } catch (error) {
    console.log('komunikat błędu z get products', error);
  }
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
  });
};
