var express = require('express');
var app = express();
var server = require('http').Server(app);
var uuid = require('node-uuid');
var serverPort = 8000;
var EventBus = require('eventbusjs');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

server.listen(serverPort);
console.log('Server started. Listening on port ' + serverPort + '...');

var Player = require('./src/model/player');
var Room = require('./src/model/room');
var Grid = require('./src/model/grid');
var io = require('socket.io')(server, {});

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var ROOMS = [];

function findAvailableRoom(type) {

    var i;

    for (i in ROOMS) {

        var room = ROOMS[i];

        if (room.type == type && ! room.isFull()) {
            return room;
        }
    }

    ROOMS.push(Room.create(type, new Grid()));
    return ROOMS[0];
}

io.sockets.on('connection', function(socket) {

    socket.id = uuid.v4();

    SOCKET_LIST[socket.id] = socket;

    socket.on('disconnect', function() {

        var i;

        for (i in ROOMS) {

            var room = ROOMS[i];

            if (! room.isFull()) {
                room.reset();
            }

            room.removePlayer(PLAYER_LIST[socket.id]);
        }

        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];

    });

    socket.on('startGame', function(data) {

        var player = Player.create(socket, '#33cc99');
        PLAYER_LIST[player.id] = player;

        var room = findAvailableRoom(data.roomType);
        
        if (! room.isFull()) {
            room.reset();
        }
        

        room.join(player);


        if (room.isFull()) {

            room.startGame();

            room.emit('gameStarted');

        }

        socket.on('keyPress', function(data) {
            player.setDirection(data.inputId);
        });

        socket.on('exit', function() {
            delete SOCKET_LIST[socket.id];
            delete PLAYER_LIST[socket.id];
        });

    });

});

setInterval(function() {

    var i;
    var pack = [];

    for (i in ROOMS) {

        var room = ROOMS[i];

        if (room.gameIsRunning()) {

            for (var j in room.getPlayers()) {

                var player = room.getPlayers()[j];
                
                player.move();

                pack.push(player.encoded());
            }

        }

    }

    for (i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('playerMove', pack);
    }

}, 1000 / 28);