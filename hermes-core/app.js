const express = require('express');
const app = express();
let mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const multer = require('multer');

// const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const personRoutes = require('./api/routes/person');
const officeRoutes = require('./api/routes/offices');

//Mongo URI
const MongoURI = 'mongodb://localhost/hermes';

//Create mongo connection
const conn = mongoose.createConnection(MongoURI, { useNewUrlParser: true });

mongoose.connect(MongoURI, { useNewUrlParser: true }, function (err) {
    if ( err) {
        return console.log(err)
    }
          console.log('MongoDB connected');
  });

mongoose.Promise = global.Promise;

app.use(morgan('dev'));

// app.use('/node_modules', express.static('node_modules'));

// Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
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

// Init gfs
let gfs;
conn.once('open', () => {
   gfs = Grid(conn.db, mongoose.mongo);
   gfs.collection('uploads');
    // all set!
});

//-----Create Sorage Engine-----------


// app.use('/gfs', (req, res) => {
//     res.render('Reservation for test');
// });

//---------------------------------------
let hermesPath = __dirname.substr(0, 22);
let path = hermesPath + 'hermes-web\\public';
app.use(express.static(path));
//----------------------------------------
// app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/persons', personRoutes);
app.use('/offices', officeRoutes);
app.use('/uploads', express.static('uploads'));
module.exports = app;

//--------------Get All files------------------------------
//https://www.youtube.com/watch?v=3f5Q9wDePzY
// app.get('/files', (req, res) => {
//     gfs.files.find().toArray((err, files) => {
//         if (!files || files.length === 0) {
//             return res.status(404).json({
//                 err: 'No files exist'
//             })
//         }  return res.status(201).json(files);
//     })
// });