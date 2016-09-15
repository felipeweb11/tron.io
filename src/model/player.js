function Player (socket, color) {

    this.id = socket.id;
    this.socket = socket;
    this.color = color;
    this.width = 8;
    this.height = 8;
    this.x = 100;
    this.y = 100;
    this.history = [];
    this.currentDirection = 'right';
    this.speed = 8;
    this.initialPosition = 'left';
    this.grid = null;

}

Player.prototype = {
    
    move: function() {

        switch(this.currentDirection) {
            case 'up':
                this.y -= this.speed;
                break;
            case 'down':
                this.y += this.speed;
                break;
            case 'right':
                this.x += this.speed;
                break;
            case 'left':
                this.x -= this.speed;
                break;
        }

        if (this.checkCollision()) {
            game.stop(cycle);
        }

        var coords = this.generateCoords();

        this.history.push(coords);
    },

    checkCollision: function() {

        for (var playerOpponent in this.grid.players) {

            if (this.collidedWith(playerOpponent)) {

                this.socket.emit('gameOver');

                this.grid.removePlayer(this);
            }

        }

    },

    collidedWith: function(opponent) {

        if ((this.x < (this.width / 2)) ||
            (this.x > this.grid.width - (this.width / 2)) ||
            (this.y < (this.height / 2)) ||
            (this.y > this.grid.height - (this.height / 2)) ||
            (this.history.indexOf(this.generateCoords()) >= 0) ||
            (typeof opponent.history !== 'undefined' && opponent.history.indexOf(this.generateCoords()) >= 0)) {
            return true;
        }
    },

    generateCoords: function() {
        return this.x + "," + this.y;
    },

    setDirection: function(direction) {

        if (direction == this.inverseDirection()) {
            return false;
        }

        this.currentDirection = direction;
    },

    inverseDirection: function() {

        switch(this.currentDirection) {
            case 'up':
                return 'down';
                break;
            case 'down':
                return 'up';
                break;
            case 'right':
                return 'left';
                break;
            case 'left':
                return 'right';
                break;
        }
    },

    encoded: function() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            color: this.color
        };
    },

    setGrid: function(grid) {
        this.grid = grid;
    }

};

Player.create = function(socket, color) {
    return new Player(socket, color);
};

module.exports = Player;