var uuid = require('node-uuid');

function Room (grid) {

    this.id = uuid.v4();
    this.grid = grid;

}

Room.prototype = {

    join: function(player) {
        this.grid.addPlayer(player);
    }

};

Room.create = function(grid) {



    return new Room(grid);
};

module.exports = Room;