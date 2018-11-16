const express = require('express');
const router = express.Router();
const Product = require('../models/product');
let mongoose = require('mongoose');

//-------GET ALL ----------------------------------
router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {

        // if (docs.length >=0){
            res.status(201).json(docs);
        // } else {
        //     res.status(404).json({message: 'No entries found'});}
    }).catch(err => {
        // console.log("From database", err);
        res.status(500).json(err);
    });
});
//-------POST------------------------------------
router.post('/', (req, res, next) => {
    const product = new Product(
        {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price
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
    Product.findById(id).exec().then(doc =>{
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
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.updateOne({_id: id }, { $set:
        {
        name: req.body.name,
        price: req.body.price
        }
    })
        .exec()
        .then(function () {
            console.log(req.body);
            res.status(200).json({
                message: 'Handling PATCH by ID=' + id + ' request to /products'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });

});
//-------------------------------------------------------------
module.exports = router;