const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const Office = require('../models/office');
const back = require('../../back');

//Mongo URI
const MongoURI = 'mongodb://localhost/hermes';

//Create mongo connection
const conn = mongoose.createConnection(MongoURI, { useNewUrlParser: true });
// Init gfs
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    // all set!
});

const storage = new GridFsStorage({
    url: MongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
// const upload = multer({ storage });
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function (req, file, cb) {
//         let now = new Date();
//         cb(null, now.getTime().toString());
//     }
// });

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
//--------------Get All files------------------------------
//https://www.youtube.com/watch?v=3f5Q9wDePzY
router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            })
        }
        return res.status(201).json(files);
    })
});

//-------------Get File by name--------------------------------
router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'This file is not exist'
            })
        }
        //File exist
        return res.status(201).json(file);

    });
});
//---------Delte file by ID -----------------------------------
router.delete('/files/:filename', (req, res) => {
    gfs.remove({filename: req.params.filename, root: 'uploads'}, (err, gridStore) => {
        if (err) {
            return res.status(404).json({
                err: 'This file is not exist'
            })
        }
        //File exist
        return res.status(200).json({message: 'File deleted'});

    });
});

//-------------Get Stream with File--------------------------------
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'This file is not exist'
            })
        }
        if (file.contentType === 'image/jpeg' || file.contentType === 'img/png')  {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'This file is not an image'
            })
        }

    });
});
//-------POST------------------------------------
router.post('/', upload.single('photo'), (req, res, next) => {

    //console.log('Saved Office Body', req.body);
    //console.log('Saved Office file', req.file);

    let prodImage = 'No Foto';
    let emptyArray = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

    if (req.file === undefined) {
        prodImage =  'No Foto';
    } else {
        prodImage = req.file.filename;
    }

    const office = new Office(
        {
            _id: new mongoose.Types.ObjectId(),
            city: req.body.city,
            address: req.body.address,
            photo: prodImage,
            financial: emptyArray,
            profit: emptyArray
        });
    office.save()
        .then(result => {
            console.log('office saved successfully');
            //back.refreshData();
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

    Office.findById(id)
        .select('city address photo financial profit')
        .exec()
        .then(office =>{
            console.log("From database", office);
            Office.remove({_id: id }).exec().then(doc =>{
                //console.log("Removed From database", office);
                if(doc){
                    //back.refreshData();
                    gfs.remove({filename: office.photo, root: 'uploads'}, (err, gridStore) => {});
                    res.status(200).json(doc);
                }else {
                    res.status(404).json({message: 'No valid entry found for provided Id'})
                }

            })

            }).catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });

});
//-----------------PATCH --EDIT-------------------------------------
router.patch('/:id', upload.single('image'), (req, res, next) => {
    //console.log('UpdateOne financial', req.body.financial);
    //console.log('UpdateOne profit', req.body.profit);
   //console.log('UpdateOne file', req);
   //console.log('req.body.file', req.file.filename);
    let prodImage = '';
    const id = req.params.id;
    if (req.file === undefined) {
        prodImage = req.body.photo
        console.log('file not exist', req.body.photo);
    } else {
        //gfs.remove({filename: req.body.photo, root: 'uploads'}, (err, gridStore) => {});
        console.log('priveous file', req.body.photo);
        console.log('file exist', req.file.filename);
        prodImage = req.file.filename;
    }
    const office = new Office(
        {
            _id: req.params.id,
            city: req.body.city,
            address: req.body.address,
           financial: req.body.financial,
           profit: req.body.profit,
            photo: prodImage
        });

    Office.updateOne({_id: id }, { $set:
            {
                city: req.body.city,
                address: req.body.address,
               financial: req.body.financial,
               profit: req.body.profit,
                photo: prodImage
            }

    })
        .exec()
        .then(function () {
            //back.refreshData();
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