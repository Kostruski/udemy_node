const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const passowrd = 12345;

let _db;

const mongoConnect = async callback => {
    try {
        const client = await MongoClient.connect(
            `mongodb+srv://Marek:${passowrd}@udemy-j7mmt.mongodb.net/shop?retryWrites=true&w=majority`,
            { useUnifiedTopology: true },
        );
        _db = client.db();
        callback();
    } catch (error) {
        console.log(error);
    }
};

const getDb = () => {
    if (_db) return _db;
    throw 'No data base';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
