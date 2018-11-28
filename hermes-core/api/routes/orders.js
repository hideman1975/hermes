const express = require('express');
const router = express.Router();
let mongoose = require('mongoose');
const Order = require('../models/order');
const back = require('../../back');
//-----------------GET ALL------------------------------------------------
router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id name')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                return {
                    _id: doc.id,
                    product: doc.product,
                    quantity: doc.quantity,
                    name: doc.name
                }
                    }
                )
            });
        }).catch(err => {
        res.status(500).json(err);
    });
});
//------------------POST SAVE------------------------------------------
router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity,
        name: req.body.name
    });
    order.save()
        .then(result => {
            console.log('order saved successfully', result);
            res.status(201).json({
                message: 'Handling POST request to /orderss',
                createdProduct: order
            })
        })
        .catch(error => {
            console.log('order did not saved because', error);
            res.status(500).json({error})
        });
});

//---------------------GET BY ID------------------------------------------
    router.get('/:orderId', (req, res, next) => {
        // const id = req.params.orderId;
        Order.findById(req.params.orderId)
            .select('product quantity _id name')
            .populate('product', 'name')
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
//-------------------------------------------------------------------------

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id: id }).exec().then(doc =>{
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
//--------------------PATCH CHANGE------------------------------------------------------
router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.updateOne({_id: id }, { $set:
            {
                product: req.body.product,
                quantity: req.body.quantity,
                name: req.body.name
            }
    })
        .exec()
        .then(function () {
            console.log(req.body);
            res.status(200).json({
                message: 'Handling PATCH by ID=' + id + ' request to /orders'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//-----------------GET STATUS------------------------------------------------
router.get('/status/st', (req, res, next) => {
             res.status(200).json(back.getProducts());
        });
//--------------------------------------------------------------------------
module.exports = router;