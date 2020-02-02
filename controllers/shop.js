const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
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
        const product = await Product.findByPk(prodId);
        console.log('get product', product);
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
        const products = await Product.findAll();
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
        const cart = await req.user.getCart();
        console.log(Object.keys(cart.__proto__)); // wyswietla magic methotd
        const products = await cart.getProducts();
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postCart = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const cart = await req.user.getCart();
        const product = await Product.findByPk(prodId);
        const fetchedFromCart = await cart.getProducts({
            where: { id: prodId },
        });
        const productInCart = fetchedFromCart[0];

        if (productInCart) {
            const oldQuantity = productInCart.cartItem.quantity;
            await cart.addProduct(productInCart, {
                through: { quantity: oldQuantity + 1 },
            });
        } else {
            await cart.addProduct(product, {
                through: { quantity: 1 },
            });
        }
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
    }
};

exports.postCartDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const cart = await req.user.getCart();
        const fetchedFromCart = await cart.getProducts({
            where: { id: prodId },
        });
        const productInCart = fetchedFromCart[0];
        const oldQuantity = productInCart.cartItem.quantity;
        if (oldQuantity === 1) {
            await productInCart.cartItem.destroy();
        } else {
            await cart.addProduct(productInCart, {
                through: { quantity: oldQuantity - 1 },
            });
        }
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
    }
};

exports.getOrders = async (req, res, next) => {
    const orders = await req.user.getOrders({ include: ['products'] });
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
    });
};

exports.postOrder = async (req, res, next) => {
    try {
        const cart = await req.user.getCart();
        const products = await cart.getProducts();
        const order = await req.user.createOrder();
        await order.addProducts(
            products.map(prod => {
                prod.orderItem = { quantity: prod.cartItem.quantity };
                return prod;
            }),
        );
        await cart.setProducts(null);
        res.redirect('/orders');
    } catch (error) {
        console.log(error);
    }
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    });
};
