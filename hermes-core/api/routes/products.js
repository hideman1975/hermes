const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/product');
let mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        let now = new Date();
        cb(null, now.getTime().toString());
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }

};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits:
        {
    fileSize: 1024 * 1024 * 5
    }
});




//-------GET ALL ----------------------------------
router.get('/', (req, res, next) => {
    Product.find()
        .select('name price productImage')
        .exec()
        .then(docs => {
            res.status(201).json(docs);
        }).catch(err => {
         res.status(500).json(err);
    });
});
//-------POST------------------------------------
router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log('the body', req.body);
    console.log('the file', req.file);
    const product = new Product(
        {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
        });
    product.save()
        .then(result => {
        console.log('product saved successfully');
            res.status(201).json({
                message: 'Handling POST request to /products',
                createdProduct: product
    })

    })
        .catch(error => {
            console.log('product do not saved because', error);
            res.status(500).json({error})
        });
});
//-------------GET BY ID------------------------------------------
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price productImage')
        .exec()
        .then(doc =>{
       console.log("From database", doc);
       if(doc){
           res.status(200).json(doc);
       }else {
           res.status(404).json({message: 'No valid entry found for provided Id'})
       }

    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });

});
//------------------DELETE------------------------------
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id }).exec().then(doc =>{
        // console.log("From database", doc);
        if(doc){
            res.status(200).json(doc);
        }else {
            res.status(404).json({message: 'No valid entry found for provided Id'})
        }

    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});
//-----------------PATCH --EDIT-------------------------------------
router.patch('/:productId', upload.single('productImage'), (req, res, next) => {

    console.log('---params---',req.params);
    console.log('--body----',req.body);
    console.log('--file----',req.file);
    let prodImage = '';
    const id = req.params.productId;
    if (req.file === undefined) {
        prodImage = req.body.productImage
    } else {
        prodImage = req.file.path;
    }
    const product = new Product(
        {
            _id: req.params.productId,
            name: req.body.name,
            price: req.body.price,
            productImage: prodImage
        });

    Product.updateOne({_id: id }, { $set:
        {
        name: req.body.name,
        price: req.body.price,
        productImage: prodImage
        }
    })
        .exec()
        .then(function () {

            res.status(200).json({
                message: 'Handling PATCH by ID=' + id + ' request to /products',
                editedProduct: product
            });
        })
        .catch(err => {
            // console.log('req', req);
            res.status(500).json({error: err});
        });

});
//-------------------------------------------------------------
module.exports = router;