let x = 5;
let timer = function() {
    // начать повторы с интервалом 2 сек
    let timerId = setInterval(function() {
        x++;
        console.log( "тик", x );
    }, 2000);

// через 5 сек остановить повторы
//     setTimeout(function() {
//         clearInterval(timerId);
//         console.log( 'стоп' );
//     }, 5000);
};

let getX = function() {
    return x;
};
module.exports.x = x;
module.exports.timer = timer;
module.exports.getX = getX;