const { ObjectId } = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, imageUrl, description, id) {
        this._id = id;
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    async save() {
        const db = getDb();
        try {
            if (this._id) {
                await db
                    .collection('products')
                    .updateOne({ _id: new ObjectId(this._id) }, { $set: this });
            } else {
                await db.collection('products').insertOne(this);
            }
            return db;
        } catch (error) {
            console.log('blad dodawania do bazy', error);
        }
    }

    static async fetchAll() {
        const db = getDb();
        const products = await db
            .collection('products')
            .find()
            .toArray();
        return products;
    }

    static async findById(id) {
        const db = getDb();
        const product = await db
            .collection('products')
            .findOne({ _id: new ObjectId(id) });
        return product;
    }

    static async updateProduct(id, updatedProduct) {
        const db = getDb();
        const product = await db
            .collection('products')
            .findOneAndReplace({ _id: new ObjectId(id) }, updatedProduct);
        return product;
    }

    static async deleteProduct(id) {
        const db = getDb();
        await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = Product;
