const request = require('request');

let products = [];
let newInteraction, getRandomInt, tikTak;

getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
newInteraction = getRandomInt(1000, 3000);


let timer = function() {
    setInterval(tikTak, 1000);
    refreshData();
   startInteraction(newInteraction);
  //stopInteraction(newInteraction);
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
            // console.log(item.name);
        })
    });
};

let getProducts = function() {
    return products;
};

// -----------Interactions---------------------------------------------
let startInteraction = (timeInteraction) => {
    //console.log('New Interaction coming with time', timeInteraction);
    let newTime = getRandomInt(10000, 20000);
    let interactionTime = getRandomInt(100000, 240000);
    let agent = getRandomInt(0, products.length);
    let typeInt = getRandomInt(0, 7);

    if(products[agent] && !products[agent].interaction) {
        products[agent].interaction = true;
        console.log( 'typeInteraction[typeInt]',  typeInteraction[typeInt]);
        products[agent].type = typeInteraction[typeInt];
        //products[agent].timer = interactionTime;
    }
    setTimeout(startInteraction, timeInteraction, newTime);
    setTimeout(stopInteraction,  interactionTime, agent);

};

// let stopInteraction = (timeInteraction) => {
//     console.log('Interaction has stopped', timeInteraction);
//     let newTime = getRandomInt(1000, 3000);
//     let agent = getRandomInt(0, products.length);
//     if(products[agent] && products[agent].interaction) {
//         products[agent].interaction = false;
//         products[agent].timer = 0;
//     }
//     setTimeout(stopInteraction, timeInteraction, newTime);
//
// };
//---------------------------------------------------------------------

let stopInteraction = (agent) => {
    // console.log('Interaction has stopped', agent);
    if(products[agent]) {
        // console.log('Interaction has stopped', agent);
        products[agent].interaction = false;
        products[agent].timer = 0;
        products[agent].type = "icon-coffee icon-large";
    }

};

tikTak = () => {
    //console.log('Tik Tak');
    products.forEach((item, i, products) =>{
        if(item.interaction) item.timer = item.timer + 1;
        // console.log(item.name);
    })
};

let typeInteraction =[
    "icon-headphones icon-large",
    "icon-comment-alt icon-large",
    "icon-envelope-alt icon-large",
    "icon-bell icon-large",
    "icon-truck icon-large",
    "icon-plane icon-large",
    "icon-coffee icon-large",
    "icon-group icon-large"
];

module.exports.timer = timer;
module.exports.refreshData = refreshData;
module.exports.getProducts = getProducts;