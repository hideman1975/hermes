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
            item.type = {class: "icon-coffee icon-large", toolTip: "AVAILABLE"};
        })

    });
};

let getProducts = function() {
    return products;
};

// -----------Interactions---------------------------------------------
let startInteraction = (timeInteraction) => {

    let newTime = getRandomInt(4000, 10000); // next interaction timer
    let agent = getRandomInt(0, products.length); // random manager
    let typeInt = getRandomInt(0, typeInteraction.length-1); //random interaction type
    let interactionTime = getRandomInt(100000, 240000);

    if(typeInteraction[typeInt].class === "icon-truck icon-large" &&
            howMuch("icon-truck icon-large") > 3) {
        console.log( 'icon-truck too much');
        setTimeout(startInteraction, timeInteraction, newTime);
    } else  if(products[agent] && !products[agent].interaction) {
        products[agent].interaction = true;
        //console.log( 'typeInteraction[typeInt]',  typeInteraction[typeInt]);
        interactionTime =  interactionTime + typeInteraction[typeInt].timeAdd; //interaction duration
        //console.log( 'interactionTime',  interactionTime);
        products[agent].type = typeInteraction[typeInt];
        setTimeout(startInteraction, timeInteraction, newTime);
        setTimeout(stopInteraction,  interactionTime, agent);
       } else {
        setTimeout(startInteraction, timeInteraction, newTime);

    }

};
//---------------------------------------------------------------------
let stopInteraction = (agent) => {
    if(products[agent]) {
        products[agent].interaction = false;
        products[agent].timer = 0;
        products[agent].type = {class: "icon-coffee icon-large", toolTip: "AVAILABLE", timeAdd: 1000};
    }
};

tikTak = () => {
    products.forEach((item, i, products) =>{
        if(item.interaction) item.timer = item.timer + 1;
    })
};

howMuch = (interactionType) => {
    let count = 0;
    products.forEach((item, index, array) => {
        if(item.type.class ===  interactionType) count++;
    });
    console.log( 'how much works', count);
    return count
};

let typeInteraction =[
    {class: "icon-headphones icon-large", toolTip: "PHONE CONVERSATION", timeAdd: 1000},
    {class: "icon-comment-alt icon-large", toolTip: "CHAT CONVERSATION", timeAdd: 1000},
    {class: "icon-truck icon-large", toolTip: "DEPARTURE TO THE CUSTOMER" , timeAdd: 1000 * 60 * 60},
    {class: "icon-facetime-video icon-large", toolTip: "VIDEO CHAT" , timeAdd: 1000},
    {class: "icon-food icon-large", toolTip: "MEAL",  timeAdd: 1000 * 60 * 10},
    {class: "icon-group icon-large", toolTip: "MEETING", timeAdd: 1000 * 60 * 20}
];

module.exports.timer = timer;
module.exports.refreshData = refreshData;
module.exports.getProducts = getProducts;