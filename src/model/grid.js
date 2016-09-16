function Grid (grid) {

    this.width = 1000;
    this.height = 720;
    this.players = [];

}

Grid.prototype = {

    addPlayer: function(player) {

        switch (this.players.length) {
            case 0:
                player.initialPosition = 'left-up';
                break;
            case 1:
                player.initialPosition = 'right-up';
                break;
            case 2:
                player.initialPosition = 'left-down';
                break;
            case 2:
                player.initialPosition = 'right-down';
                break;
        }

        player.init();
        player.setGrid(this);

        this.players.push(player);
    },

    removePlayer: function(player) {

        for (var i in this.players) {

            var p = this.players[i];

            if (p.id == player.id) {
                this.players.splice(i, 1);
            }

        }
    },

    getPlayers: function() {
        return this.players;
    }

};

Grid.create = function() {
    return new Grid();
};

module.exports = Grid;