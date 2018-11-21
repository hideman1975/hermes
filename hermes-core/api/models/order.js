let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let orderSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: {type: Number, default: 1},
    name: {type: String, required: true}
}, {collection: 'orders'});


module.exports = mongoose.model('Orders', orderSchema);