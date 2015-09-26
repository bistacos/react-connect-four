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
      var forbiddenHorizIndices = [4,5,6,11,12,13,18,19,20,25,26,27,32,33,34];
      // logic to check for a winner horizontally
      for (var i = 0, l = 42; i < l; i++) {
        if ( forbiddenHorizIndices.indexOf(i) > -1 ) { continue; }
        var checkHoriz = check(t[i], t[i+1], t[i+2], t[i+3]);
        if (checkHoriz) {
          return t[i];
        }
      }

      // logic to check for a winner vertically
      for (var i = 0, l = 21; // no vertical winners possible past this index
            i < l; i++) {
        var checkVert = check(t[i], t[i+7], t[i+14], t[i+21]);
        if (checkVert) {
          return t[i];
        }
      }

      // array of numbers that preclude a down-to-right diagonal winner
      // i.e. a win by wrapping around the board
      var forbiddenDownRightIndices = [4,5,6,11,12,13,18,19,20];
      // logic to check for a winner diagonally down-to-the-right
      for (var i = 0, l = 21; i < l; i++) { 
        if ( forbiddenDownRightIndices.indexOf(i) > -1 ) { continue; }
        var checkDR = check(t[i], t[i+8], t[i+16], t[i+24]);
        if (checkDR) {
          return t[i];
        }
      }

     // array of numbers that preclude a down-to-left diagonal winner
      // i.e. a win by wrapping around the board
      var forbiddenDownLeftIndices = [0,1,2,7,8,9,14,15,16];
      // logic to check for a winner diagonally down-to-the-right
      for (var i = 0, l = 21; i < l; i++) { 
        if ( forbiddenDownLeftIndices.indexOf(i) > -1 ) { continue; }
        var checkDL = check(t[i], t[i+6], t[i+12], t[i+18]);
        if (checkDL) {
          return t[i];
        }
      }

      // no winner yet found, return d for draw if board full, otherwise return 'n'
      if (t.join('').length === 42) return 'd';
      return 'n';
    },

    // helper function for tileClick to find the lowest position
    // in a column that isn't occupied
    lowestOpenPosInColumn: function (position, tiles) {
      // find (zero-indexed) column
      var column = position % 7;

      for (var i = (35 + column); i > -1; i -= 7) {
        if ( tiles[i] === 'x' || (tiles[i] === 'o') ) {
          continue;
        } else {
          return i;
        }
      }
    },

    tileClick: function(position, player) {
      var tiles = this.state.tiles;
      // If selected position already filled, return to prevent it being replaced
      if ( 
          (tiles[position] === 'x' || tiles[position] === 'o') ||
          (this.state.winner !== 'n')
        ) { return; }

      var newPos = this.lowestOpenPosInColumn(position, tiles);
      tiles[newPos] = player;
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
        <h3 className={this.props.winner === 'd' ? 'visible' : 'hidden'}>Tie Game </h3>
        <button onClick={this.props.resetAction}>Reset Game</button>
      </div>;
    }
  });

  React.renderComponent(
    <Game />,
    document.getElementById('container')
  );
  
})();