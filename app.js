var express = require('express');
var app = express();
var server = require('http').Server(app);


app.get('/', function(req, res) {

    res.sendFile(__dirname + '/client/index.html');

});

app.get('/snake', function(req, res) {

    res.sendFile(__dirname + '/client/snake.html');

});

app.get('/tron', function(req, res) {

    res.sendFile(__dirname + '/client/tron.html');

});


app.use('/client', express.static(__dirname + '/client'));

server.listen(8000);

console.log('Server started.');

var io = require('socket.io')(server, {});

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var COLORS = ['red', 'gren', 'yellow', 'black', 'blue'];

var Player = function(id) {

    var self = {
        x: 250,
        y: 250,
        id: id,
        color: COLORS[Math.floor((COLORS.length * Math.random()))],
        pressingRight: false,
        pressingLeft: false,
        pressingUp: false,
        pressingDown: false,
        maxSpd: 10
    };

    self.updatePosition = function() {

        if (self.pressingRight)
            self.x += self.maxSpd;

        if (self.pressingLeft)
            self.x -= self.maxSpd;

        if (self.pressingUp)
            self.y -= self.maxSpd;

        if (self.pressingDown)
            self.y += self.maxSpd;

    };

    return self;

};

io.sockets.on('connection', function(socket) {

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    var player = Player(socket.id);

    PLAYER_LIST[socket.id] = player;

    socket.on('disconnect', function() {

        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];

    });

    socket.on('keyPress', function(data) {

        if (data.inputId === 'left')
            player.pressingLeft = data.state;

        else if (data.inputId === 'right')
            player.pressingRight = data.state;

        else if (data.inputId === 'up')
            player.pressingUp = data.state;

        else if (data.inputId === 'down')
            player.pressingDown = data.state;

    });

});


setInterval(function() {

    var pack = [];

    for (var i in PLAYER_LIST) {

        var player = PLAYER_LIST[i];

        player.updatePosition();

        pack.push({
            x: player.x,
            y: player.y,
            color: player.color
        });
    }

    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition', pack);
    }


}, 1000 / 25);