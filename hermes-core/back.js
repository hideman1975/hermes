const request = require('request');

let products = [];
let newInteraction, getRandomInt;

getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
newInteraction = getRandomInt(1000, 3000);

let timer = function() {
   refreshData();
   startInteraction(newInteraction);
   stopInteraction(newInteraction);
  };

let refreshData = function() {
    request({
        method: 'GET',
        uri: 'http://localhost:3032/persons',
        body: {'msg': 'secret'},
        json: true
    }, function (error, response, body) {
        products = body;
        products.forEach((item, i, products) =>{
            item.interaction = true;
            // console.log(item.name);
        })
    });
};

let getProducts = function() {
    return products;
};

// -----------Interactions---------------------------------------------
let startInteraction = (timeInteraction) => {
    console.log('New Interaction coming with time', timeInteraction);
    let newTime = getRandomInt(1000, 3000);
    let agent = getRandomInt(0, 11);
    if(products[agent]) products[agent].interaction = true;
    setTimeout(startInteraction, timeInteraction, newTime);

};

let stopInteraction = (timeInteraction) => {
    console.log('Interaction has stopped', timeInteraction);
    let newTime = getRandomInt(1000, 3000);
    let agent = getRandomInt(0, 11);
    if(products[agent]) products[agent].interaction = false;
    setTimeout(stopInteraction, timeInteraction, newTime);

};
//---------------------------------------------------------------------
module.exports.timer = timer;
module.exports.refreshData = refreshData;
module.exports.getProducts = getProducts;