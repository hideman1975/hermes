const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json([
        {
        _id: '123456',
        name: 'Andrew Manaenko',
        age: '43'
    },
        {
            _id: '454353',
            name: 'Andrei Roginskiy',
            age: '45'
        },
        {
            _id: '1789879',
            name: 'Sergei Bobrunin',
            age: '48'
        }
    ]);
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.id,
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message: 'Handling POST create Order',
        createdOrder: order
    });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Handling GET by ID=' + id + ' request to /order'
    });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Handling DELETE by ID=' + id + ' request to /order'
    });
});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Handling PATCH by ID=' + id + ' request to /order'
    });
});

module.exports = router;