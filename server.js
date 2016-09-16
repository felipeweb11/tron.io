var express = require('express');
var app = express();
var server = require('http').Server(app);
var uuid = require('node-uuid');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

server.listen(8000);

console.log('Server started.');

var Player = require('./src/model/player');
var Room = require('./src/model/room');
var Grid = require('./src/model/grid');
var io = require('socket.io')(server, {});

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var CURRENT_ROOM = 0;

io.sockets.on('connection', function(socket) {

    socket.id = uuid.v4();

    SOCKET_LIST[socket.id] = socket;

    var player = Player.create(socket, '#33cc99');

    if (CURRENT_ROOM == 0) {
        CURRENT_ROOM = Room.create(new Grid());
    }

    CURRENT_ROOM.join(player);

    PLAYER_LIST[player.id] = player;

    socket.on('disconnect', function() {

        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];

    });

    socket.on('keyPress', function(data) {
        player.setDirection(data.inputId);
    });

    socket.on('exit', function() {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });

});

setInterval(function() {

    var pack = [];

    for (var i in PLAYER_LIST) {

        var player = PLAYER_LIST[i];

        player.move();

        pack.push(player.encoded());
    }

    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition', pack);
    }

}, 1000 / 28);