const request = require('request');

let products = [];
let newInteraction, getRandomInt, tikTak;

getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
newInteraction = getRandomInt(1000, 3000);


let timer = function() {
    setInterval(tikTak, 1000);
    refreshData();
   startInteraction(newInteraction);
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
            item.interaction = false;
            item.timer = 0;
            item.type = "icon-coffee";
        })
    });
};

let getProducts = function() {
    return products;
};

// -----------Interactions---------------------------------------------
let startInteraction = (timeInteraction) => {

    let newTime = getRandomInt(4000, 10000);
    let interactionTime = getRandomInt(100000, 240000);
    let agent = getRandomInt(0, products.length);
    let typeInt = getRandomInt(0, typeInteraction.length-1);

    if(products[agent] && !products[agent].interaction) {
        products[agent].interaction = true;
        console.log( 'typeInteraction[typeInt]',  typeInteraction[typeInt]);
        products[agent].type = typeInteraction[typeInt];
       }
    setTimeout(startInteraction, timeInteraction, newTime);
    setTimeout(stopInteraction,  interactionTime, agent);

};
//---------------------------------------------------------------------
let stopInteraction = (agent) => {
    if(products[agent]) {
        products[agent].interaction = false;
        products[agent].timer = 0;
        products[agent].type = "icon-coffee icon-large";
    }
};

tikTak = () => {
    products.forEach((item, i, products) =>{
        if(item.interaction) item.timer = item.timer + 1;
    })
};

let typeInteraction =[
    "icon-headphones icon-large",
    "icon-comment-alt icon-large",
    "icon-truck icon-large",
    "icon-plane icon-large",
    "icon-food icon-large",
    "icon-group icon-large"
];

module.exports.timer = timer;
module.exports.refreshData = refreshData;
module.exports.getProducts = getProducts;