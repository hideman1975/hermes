let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let personSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    age: {type: Number, required: true},
    photo: {type: String, required: true}
}, {collection: 'persons'});

module.exports = mongoose.model('Persons', personSchema);