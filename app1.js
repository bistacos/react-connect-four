/**
* @jsx React.DOM
*/
(function (){
  
  var Game = React.createClass({
    getInitialState: function() {
      return {
        //Initial state of the game board
        tiles: [
        '','','','','','','',
        '','','','','','','',
        '','','','','','','',
        '','','','','','','',
        '','','','','','','',
        '','','','','','','',
        ],

        // O's always go first
        turn: 'o',

        // Winning player eventually set here
        winner: 'n'
      };
    },

    checkBoard: function() {
      var t = this.state.tiles;

      // uses regexp to return winner (if any)
      var check = function(a, b, c, d) {
        return !!(a + b + c + d).match(/^(xxxx|oooo)$/gi);
      };
      // logic to check for horizontal winners

      // array of numbers that mean there can't be a horizontal winner,
      // i.e. a win by wrapping around to the next row
      var forbiddenHorizIndeces = [
        4,5,6,
        11,12,13,
        18,19,20,
        25,26,27,
        32,33,34
      ];
      for (var i = 0, l = 42; i < l; i++) {
        if ( forbiddenHorizIndeces.indexOf(i) > -1 ) {
          continue;
        }
        var checkHoriz = check(t[i], t[i+1], t[i+2], t[i+3]);
        if (checkHoriz) {
          return t[i];
        }
      }

      // // Deprecated tic tac toe logic
      // if (check(t[0], t[1], t[2])) return t[0];
      // if (check(t[3], t[4], t[5])) return t[3];
      // if (check(t[6], t[7], t[8])) return t[6];

      // if (check(t[0], t[3], t[6])) return t[0];
      // if (check(t[1], t[4], t[7])) return t[1];
      // if (check(t[2], t[5], t[8])) return t[2];
      
      // if (check(t[0], t[4], t[8])) return t[0];
      // if (check(t[2], t[4], t[6])) return t[2];

      if (t.join('').length === 42) return 'd';
      return 'n';
    },

    tileClick: function(position, player) {
      var tiles = this.state.tiles;
      // If selected position already filled, return to prevent it being replaced
      if ( 
          (tiles[position] === 'x' || tiles[position] === 'o') ||
          (this.state.winner !== 'n')
        ) { return; }
      tiles[position] = player;
      this.setState({tiles: tiles, turn: player === 'o' ? 'x' : 'o',
        winner: this.checkBoard()
      });
    },

    resetGame: function() {
      this.setState(this.getInitialState());
    },

    render: function() {
      return (
        <div>
          <div id="game">
            { this.state.tiles.map(function(tile, pos) {
              return (
                <Tile status={tile} key={pos} turn={this.state.turn} tileClick={this.tileClick} />
              );
            }, this) }
          </div>
          <Menu turn={this.state.turn} winner={this.state.winner} resetAction={this.resetGame} />
        </div>
      );
    }
  });

  var Tile = React.createClass({
    clickHandler: function() {
      this.props.tileClick(this.props.key, this.props.turn);
    },

    render: function() {
      // tile-status- + this.props.status helps with debugging?  User never sees it
      return <div className={this.props.status === '' ? 'tile' : 'tile status-' + this.props.status} onClick={this.clickHandler}>{this.props.status}</div>;
    }
  });

  var Menu = React.createClass({
    render: function() {
      return <div id="menu">
        <h3 className={this.props.winner === 'n' ? 'visible' : 'hidden'}>Player {this.props.turn}'s turn.</h3>
        <h3 className={(this.props.winner === 'n') || (this.props.winner=== 'd') ? 'hidden' : 'visible'}>Player {this.props.winner} won!</h3>
        <h3 className={this.props.winner === 'd' ? 'visible' : 'hidden'}>Draw Game </h3>
        <button onClick={this.props.resetAction}>Reset Game</button>
      </div>;
    }
  });

  React.renderComponent(
    <Game />,
    document.getElementById('container')
  );
  
})();