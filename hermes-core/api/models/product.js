let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true}
}, {collection: 'products'});

let UserData = mongoose.model('UserData', productSchema);

module.exports = mongoose.model('Products', productSchema);