const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    async save() {
        try {
            const db = getDb();
            const updatedDb = await db.collection('products').insertOne(this);
            console.log('po zmianie', updatedDb);
        } catch (error) {
            console.log('błąd dodawania do bazy', error);
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
}

module.exports = Product;
