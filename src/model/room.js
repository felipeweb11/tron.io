var uuid = require('node-uuid');

function Room (type, grid) {

    this.id = uuid.v4();
    this.grid = grid;
    this.gameStarted = false;
    this.type = type;

    switch (type) {
        case 'two-players':
            this.maxPlayers = 2;
            break;
        case 'four-players':
            this.maxPlayers = 4;
            break;
    }

}

Room.prototype = {

    join: function(player) {
        this.grid.addPlayer(player);
    },

    removePlayer: function(player) {
        this.grid.removePlayer(player);
    },

    getPlayers: function() {
        return this.grid.getPlayers();
    },

    isFull: function() {
        return this.grid.players.length >= this.maxPlayers;
    },

    gameIsRunning: function() {
        return this.gameStarted;
    },

    startGame: function() {
        this.gameStarted = true;
    },

    reset: function() {
        this.gameStarted = false;
    },

    emit: function(message, data) {

        if (typeof data === 'undefined') {
            data = {};
        }

        for (var i in this.getPlayers()) {

            var player = this.getPlayers()[i];

            player.socket.emit(message, data);
        }

    }

};

Room.create = function(type, grid) {
    return new Room(type, grid);
};

module.exports = Room;