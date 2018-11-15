let express = require('express');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let userDataSchema = new Schema({
    name: {type: String, required: true},
    age: {type: String, required: true}
}, {collection: 'user-data'});

let UserData = mongoose.model('UserData', userDataSchema);
let router = express.Router();
let app = express();
let hermesPath = __dirname.substr(0, 22);
let path = hermesPath + 'hermes-web\\public';

mongoose.connect('mongodb://localhost/hermes', { useNewUrlParser: true }, function (err) {
if ( err) {
        return console.log(err)
    }
        app.listen(3032, function () {
        console.log('API app started at 3032 port');
     });
});

app.use(express.static(path));

router.get('/get-data', function (req, res, next) {
    UserData.find().then(function (doc) {
           res.send(doc);
     });
 });

app.get('/get-data', router);

