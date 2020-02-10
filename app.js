const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5e414c6011f80f2c9c69de45')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

(async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://Marek:12345@udemy-j7mmt.mongodb.net/shop?retryWrites=true&w=majority',
            { useUnifiedTopology: true, useNewUrlParser: true },
        );
        if (!await User.findOne()) {
            const user = new User({
                name: 'Piko',
                email: 'piko@wp.pl',
                cart: {
                    items: [],
                },
            });
            await user.save();
        }

        app.listen(3000);
    } catch (error) {
        console.log(error);
    }
})();
