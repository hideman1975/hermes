const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3032;
const server = http.createServer(app);

server.listen(port, function () {
    console.log('API app started at '+ port +' port');
});

