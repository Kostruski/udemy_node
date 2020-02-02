const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProduct = async (req, res, next) => {
    const { title } = req.body;
    const { imageUrl } = req.body;
    const { price } = req.body;
    const { description } = req.body;
    const userId = req.user.id;
    try {
        await req.user.createProduct({
            title,
            imageUrl,
            price,
            description,
            userId,
        });

        res.redirect('/admin/products');
    } catch (error) {
        console.log(error);
        res.redirect('/admin/products');
    }
};

exports.getEditProduct = async (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    try {
        const product = await req.user.getProducts({ where: { id: prodId } });
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product[0],
        });
    } catch (error) {
        res.redirect('/cart',);
    }
};

exports.postEditProduct = async (req, res, next) => {
    const { productId, title, price, imageUrl, description } = req.body;
    try {
        const product = await Product.findByPk(productId);
        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;
        product.save();
        res.redirect('/admin/products');
    } catch (error) {
        console.log(error);
        res.redirect('/admin/products');
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const product = await Product.findByPk(prodId);
        await product.destroy();
        res.redirect('/admin/products');
    } catch (error) {
        console.log(error);
        // redirect to error page
    }
};
