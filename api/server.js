var express = require('express');
var app     = express();
var cors    = require('cors');
var sockets = require('./app/custom/sockets');
app.use(cors());


var server = app.listen(10000,function () {
    console.log('Ejecutando Puerto 1000!');
});

io  = require('socket.io').listen(server);
require('./app/routes.js')(app);

app.set('socketIo',io);
sockets.refreshGames(io);