const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class User {
    constructor(userId, username, email, cart) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this.userId = userId;
    }

    async save() {
        const db = getDb();
        const user = await db.collection('users').findOne();

        try {
            !user && (await db.collection('users').insertOne(this));
        } catch (error) {
            console.log('nie udalo sie dodac urzytkownika', error);
        }
    }

    async getCart() {
        const db = getDb();
        const productsInCartIds = this.cart.items.map(
            element => element.productId,
        );
        const productsInCart = await db
            .collection('products')
            .find({ _id: { $in: productsInCartIds } }) // tylko produkty których id jest w tablicy
            .toArray();
        const products = this.cart.items.map(item => {
            const product = productsInCart.find(prod => {
                return prod._id.toString() === item.productId.toString();
            });
            product.quantity = item.quantity;
            return product;
        });
        return products;
    }

    async addToCart(productId) {
        const db = getDb();
        const id = new ObjectId(productId);
        const indexOfProductInCart = this.cart.items.findIndex(
            product => product.productId.toString() === productId.toString(),
        );
        if (indexOfProductInCart !== -1) {
            this.cart.items[indexOfProductInCart].quantity++;
        } else {
            const newInCart = { productId: id, quantity: 1 };
            this.cart.items.push(newInCart);
        }

        const cart = await db
            .collection('users')
            .updateOne({ _id: this.userId }, { $set: { cart: this.cart } });
        return cart;
    }

    async removeFromCart(productId) {
        const db = getDb();
        const id = new ObjectId(productId);

        const indexOfProductInCart = this.cart.items.findIndex(
            product => product.productId.toString() === id.toString(),
        );
        const quantity = this.cart.items[indexOfProductInCart].quantity;
        if (quantity > 1) {
            this.cart.items[indexOfProductInCart].quantity--;
        } else {
            this.cart.items.splice(indexOfProductInCart, 1);
        }
        const cart = await db
            .collection('users')
            .updateOne({ _id: this.userId }, { $set: { cart: this.cart } });
        return cart;
    }

    async addOrder() {
        const db = getDb();
        const productsInCart = await this.getCart();
        const order = {
            items: productsInCart,
            user: {
                _id: new ObjectId(this.userId),
                name: this.username,
                email: this.email,
            },
        };
        await db.collection('orders').insertOne(order);
        this.cart.items = [];
        await db
            .collection('users')
            .updateOne({ _id: this.userId }, { $set: { cart: this.cart } });
    }

    async getOrders() {
        const db = getDb();
        const id = new ObjectId(this.userId);
        const orders = await db
            .collection('orders')
            .find({ 'user._id': id })
            .toArray();
        return orders;
    }

    static async findById(id) {
        const db = getDb();
        const _id = new ObjectId(id);
        try {
            const user = await db.collection('users').findOne({ _id });
            return user;
        } catch (error) {
            console.log(error, 'from find user');
        }
    }
}

module.exports = User;
