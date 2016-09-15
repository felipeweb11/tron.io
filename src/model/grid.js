function Grid (grid) {

    this.width = 1000;
    this.height = 700;
    this.players = [];

}

Grid.prototype = {

    addPlayer: function(player) {

        player.setGrid(this);

        this.players.push(player);
    },

    removePlayer: function(player) {

        var i = 0;

        for (var p in this.players) {

            if (p.id == player.id) {
                this.players.splice(i, 1);
            }

            i++;
        }
    }

};

Grid.create = function() {
    return new Grid();
};

module.exports = Grid;