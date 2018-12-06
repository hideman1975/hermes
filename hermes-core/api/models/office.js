let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let officeSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    city: {type: String, required: true},
    address: {type: String, required: true},
    photo: {type: String, required: true}
}, {collection: 'offices'});

module.exports = mongoose.model('Offices', officeSchema);