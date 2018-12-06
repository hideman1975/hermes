const express = require('express');
const app = express();
let mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const personRoutes = require('./api/routes/person');
const officeRoutes = require('./api/routes/offices');



mongoose.connect('mongodb://localhost/hermes', { useNewUrlParser: true }, function (err) {
    if ( err) {
        return console.log(err)
    }
          console.log('MongoDB connected');
  });

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers','Origin, X-Requested-With,' +
        ' Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
            'POST, GET, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});
//---------------------------------------
let hermesPath = __dirname.substr(0, 22);
let path = hermesPath + 'hermes-web\\public';
app.use(express.static(path));
//----------------------------------------
// app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/persons', personRoutes);
app.use('/offices', officeRoutes);

module.exports = app;