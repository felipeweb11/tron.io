function Player (socket, color) {

    this.id = socket.id;
    this.socket = socket;
    this.color = color;
    this.width = 8;
    this.height = 8;
    this.x = 0;
    this.y = 0;
    this.trail = [];
    this.currentDirection = 'right';
    this.speed = 8;
    this.initialPosition = 'left-up';
    this.grid = null;
    this.active = true;

}

Player.prototype = {

    init: function() {

        switch (this.initialPosition) {

            case 'left-up':
                this.x = 100;
                this.y = 100;
                this.color = '#33cc99';
                this.currentDirection = 'right';
                break;

            case 'right-up':
                this.x = 900;
                this.y = 100;
                this.color = '#f00';
                this.currentDirection = 'left';
                break;

            case 'left-down':
                this.x = 100;
                this.y = 620;
                this.color = '#00f';
                this.currentDirection = 'right';
                break;

            case 'right-down':
                this.x = 900;
                this.y = 620;
                this.color = '#000';
                this.currentDirection = 'left';
                break;

        }

    },
    
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
            this.active = false;

            this.socket.emit('gameOver');

        }

        this.trail.push(this.position());
    },

    checkCollision: function() {

        var i;

        for (i in this.grid.players) {

            var playerOpponent = this.grid.players[i];

            if (this.collidedWith(playerOpponent)) {
                return true;
            }

        }

        return false;

    },

    collidedWith: function(opponent) {

        var halfWidth =  this.width / 2;
        var halfHeight =  this.height / 2;
        var position = this.position();

        return(this.x < halfWidth) ||
            (this.y < halfHeight) ||
            (this.x > this.grid.width - halfWidth) ||
            (this.y > this.grid.height - halfHeight) ||
            (this.trail.indexOf(position) >= 0) ||
            (opponent.trail.indexOf(position) >= 0);
    },

    position: function() {
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

    isActive: function() {
        return this.active;
    },

    encoded: function() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            color: this.color,
            active: this.active
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