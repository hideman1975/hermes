const express = require('express');
const router = express.Router();
const multer = require('multer');
const Office = require('../models/office');
const back = require('../../back');
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
    Office.find()
        .select('city address photo financial profit')
        .exec()
        .then(docs => {
            res.status(201).json(docs);
        }).catch(err => {
        res.status(500).json(err);
    });
});
//-------POST------------------------------------
router.post('/', upload.single('photo'), (req, res, next) => {

    let prodImage = '';

    if (req.file === undefined) {
        prodImage = req.body.photo
    } else {
        prodImage = req.file.path;
    }

    const office = new Office(
        {
            _id: new mongoose.Types.ObjectId(),
            city: req.body.city,
            address: req.body.address,
            photo: prodImage,
            financial: req.body.financial,
            profit: req.body.profit
        });
    office.save()
        .then(result => {
            console.log('office saved successfully');
            back.refreshData();
            res.status(201).json({
                message: 'Handling POST request to /offices',
                createdOffice: office
            })

        })
        .catch(error => {
            console.log('office do not saved because', error);
            res.status(500).json({error})
        });
});
//-------------GET BY ID------------------------------------------
router.get('/:officeId', (req, res, next) => {
    const id = req.params.officeId;
    Office.findById(id)
        .select('city address photo financial profit')
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
router.delete('/:officeId', (req, res, next) => {
    const id = req.params.officeId;
    Office.remove({_id: id }).exec().then(doc =>{
        // console.log("From database", doc);
        if(doc){
            back.refreshData();
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
router.patch('/:id', upload.single('photo'), (req, res, next) => {
    console.log('UpdateOne financial', req.body.financial);
    console.log('UpdateOne profit', req.body.profit);
    let prodImage = '';
    const id = req.params.id;
    if (req.file === undefined) {
        prodImage = req.body.photo
    } else {
        prodImage = req.file.path;
    }
    const office = new Office(
        {
            _id: req.params.id,
            city: req.body.city,
            address: req.body.address,
            // financial: req.body.financial,
            // profit: req.body.profit,
            photo: prodImage
        });

    Office.updateOne({_id: id }, { $set:
            {
                city: req.body.city,
                address: req.body.address,
                // financial: req.body.financial,
                // profit: req.body.profit,
                photo: prodImage
            }

    })
        .exec()
        .then(function () {
            back.refreshData();
            res.status(200).json({
                message: 'Handling PATCH by ID=' + id + ' request to /offices',
                editedPerson: office
            });
        })
        .catch(err => {
            // console.log('req', req);
            res.status(500).json({error: err});
        });

});
//-------------------------------------------------------------
module.exports = router;