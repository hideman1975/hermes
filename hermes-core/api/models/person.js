let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let personSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    position: {type: String, required: true},
    age: {type: Number, required: true},
    photo: {type: String, required: true},
    office: {type: mongoose.Schema.Types.ObjectId, ref: 'Offices'},
}, {collection: 'persons'});

module.exports = mongoose.model('Persons', personSchema);