const express = require('express');
const router = express.Router();
const multer = require('multer');
const Person = require('../models/person');
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
    Person.find()
        .select('name age photo office')
        .populate('office')
        .exec()
        .then(docs => {
            res.status(201).json(docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    age: doc.age,
                    office: doc.office,
                    photo: doc.photo
                }
            }));
        }).catch(err => {
        res.status(500).json(err);
    });
});
//-------POST------------------------------------
router.post('/', upload.single('photo'), (req, res, next) => {
    Office.findById(req.body.office)
        .then(office => {
            if(!office){
                return res.status(404).json({
                    message: 'Office not exist'
                });
            }
            console.log('Office exist', office);
            let prodImage = '';
            if (req.file === undefined) {
                prodImage = req.body.photo
            } else {
                prodImage = req.file.path;
            }

            const person = new Person({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                age: req.body.age,
                office: req.body.office,
                photo: prodImage
            });
            person.save()
                .then(result => {
                    console.log('person saved successfully');
                    back.refreshData();
                    res.status(201).json({
                        message: 'Handling POST request to /persons',
                        createdPerson: person
                    })
                })
        })
});
//-------------GET BY ID------------------------------------------
router.get('/:personId', (req, res, next) => {

    Person.findById(req.params.personId)
        .select('name age photo office')
        .exec()
        .then(doc =>{
            if(!doc){
                return res.status(404).json({
                    message: 'Person not exist'
                });
            }
            Office.findById(doc.office)
                .select('_id city photo address')
                .exec()
                .then(office => {
                    res.status(200).json({
                        _id: doc.id,
                        name: doc.name,
                        age: doc.age,
                        office: office
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error: err});
                });
            console.log("From database", doc);
          })
        .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});
//------------------DELETE------------------------------
router.delete('/:personId', (req, res, next) => {
    const id = req.params.personId;
    Person.remove({_id: id }).exec().then(doc =>{
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
router.patch('/:personId', upload.single('photo'), (req, res, next) => {
    //console.log('Save Person with office -', JSON.parse('{ "name": "John Doe", "age": 42 }'));
    console.log('Save Person reqe -', req);
    console.log('Save Person with office -', JSON.stringify(req.body.office));
    console.log('Save Person with body -', req.body);
    let prodImage = '';
    const id = req.params.personId;
    if (req.file === undefined) {
        prodImage = req.body.photo
    } else {
        console.log('Save Person with photo ', req.file.path);
        prodImage = req.file.path;
    }
    const person = new Person(
        {
            _id: req.params.personId,
            name: req.body.name,
            age: req.body.age,
            office: req.body.office,
            photo: prodImage
        });

    Person.updateOne({_id: id }, { $set:
            {
                name: req.body.name,
                age: req.body.age,
                office: req.body.office,
                photo: prodImage
            }
    })
        .exec()
        .then(function () {
            back.refreshData();
            res.status(200).json({
                message: 'Handling PATCH by ID=' + id + ' request to /persons',
                editedPerson: person
            });
        })
        .catch(err => {
            // console.log('req', req);
            res.status(500).json({error: err});
        });

});
//-------------------------------------------------------------
module.exports = router;