import { Ship } from "./ship.js";

class Gameboard {
  /**
   * Create a new Gameboard
   */
  constructor() {
    this._boardSize = 10;
    this.ships = [];
    this.boardMatrix = [];
    for (let i = 0; i < this._boardSize; i++) {
      this.boardMatrix[i] = [];
      for (let j = 0; j < this._boardSize; j++) {
        this.boardMatrix[i][j] = { isAttacked: false, hasShip: false };
      }
    }
  }

  /**
   * Add a new Ship to the Gameboard
   * @param {number} length ship length
   * @param {number} x x coordinate; between 0 and 9 (inclusive)
   * @param {number} y x coordinate; between 0 and 9 (inclusive)
   * @param {boolean} horizontal direction the ship is facing
   */
  addShip(length, x, y, horizontal = true) {
    // throw error if start position is outside board
    if (x >= this._boardSize || y >= this._boardSize || x < 0 || y < 0) {
      throw new Error("Gameboard.addShip(): Cannot create ship outside of board");
    }

    // adjust start position if ship is too long to fit on board
    if (horizontal && x + length >= this._boardSize) {
      x -= x + length - this._boardSize;
    }
    if (!horizontal && y + length >= this._boardSize) {
      y -= y + length - this._boardSize;
    }

    // get position array
    const position = [];
    if (horizontal) {
      for (let i = 0; i < length; i++) {
        position.push([x + i, y]);
        // throw error if there is no space at this position
        if (this.boardMatrix[x + 1][y].hasShip) {
          throw new Error("Gameboard.addShip(): Cannot create ship; Position is already taken");
        }
      }
    } else {
      for (let i = 0; i < length; i++) {
        position.push([x, y + i]);
        // throw error if there is no space at this position
        if (this.boardMatrix[x][y + 1].hasShip) {
          throw new Error("Gameboard.addShip(): Cannot create ship; Position is already taken");
        }
      }
    }

    // add position of new ship to boardMatrix;
    for (let coordinate of position) {
      this.boardMatrix[coordinate[0]][coordinate[1]].hasShip = true;
    }

    // create ship and add to ships array
    let ship = new Ship(length);
    this.ships.push({ ship, position, horizontal });
  }

  receiveAttack(x, y) {
    if (this.boardMatrix[x][y].isAttacked) {
      throw new Error("Gameboard.receiveAttack(): Cannot attack same position twice");
    }
    this.boardMatrix[x][y].isAttacked = true;

    // if attack hit ship, find and call hit() function on it
    if (this.boardMatrix[x][y].hasShip) {
      for (let ship of this.ships) {
        for (let coordinate of ship.position) {
          if (coordinate[0] === x && coordinate[1] === y) {
            ship.ship.hit();
            return;
          }
        }
      }
    }
  }

  allShipsSunk() {
    for (let ship of this.ships) {
      if (!ship.ship.sunk) {
        return false;
      }
    }
    return true;
  }
}

export { Gameboard };
