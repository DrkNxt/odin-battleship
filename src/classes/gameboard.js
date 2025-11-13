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
   * @param {Array<number>} position position coordinates between 0 and 9 (inclusive): [x, y]
   * @param {boolean} placeHorizontally direction the ship is facing
   */
  addShip(length, position, placeHorizontally = true) {
    const pos = { x: position[0], y: position[1] };
    // throw error if start position is outside board
    if (pos.x >= this._boardSize || pos.y >= this._boardSize || pos.x < 0 || pos.y < 0) {
      throw new Error("Gameboard.addShip(): Cannot create ship outside of board");
    }

    // adjust start position if ship is too long to fit on board
    if (placeHorizontally && pos.x + length >= this._boardSize) {
      pos.x -= pos.x + length - this._boardSize;
    }
    if (!placeHorizontally && pos.y + length >= this._boardSize) {
      pos.y -= pos.y + length - this._boardSize;
    }

    // get coordinates array
    const coordinates = [];
    if (placeHorizontally) {
      for (let i = 0; i < length; i++) {
        // throw error if there is no space at this position
        this.hasEnoughSpace(pos.x + i, pos.y);
      }
      for (let i = 0; i < length; i++) {
        coordinates.push([pos.x + i, pos.y]);
      }
    } else {
      for (let i = 0; i < length; i++) {
        // throw error if there is no space at this position
        this.hasEnoughSpace(pos.x, pos.y + i);
      }
      for (let i = 0; i < length; i++) {
        coordinates.push([pos.x, pos.y + i]);
      }
    }

    // add coordinates of new ship to boardMatrix;
    for (let coordinate of coordinates) {
      this.boardMatrix[coordinate[0]][coordinate[1]].hasShip = true;
    }

    // create ship and add to ships array
    let ship = new Ship(length);
    this.ships.push({ ship, coordinates, horizontal: placeHorizontally });
  }

  /**
   * Test if there is enough space to place ship
   * @param {number} x
   * @param {number} y
   */
  hasEnoughSpace(x, y) {
    if (this.boardMatrix[x][y].hasShip) {
      throw new Error("Gameboard.addShip(): Cannot create ship; Position is already taken");
    }
    if (x + 1 < this._boardSize && this.boardMatrix[x + 1][y].hasShip) {
      throw new Error("Gameboard.addShip(): Cannot create ship; Right position is already taken");
    }
    if (x - 1 >= 0 && this.boardMatrix[x - 1][y].hasShip) {
      throw new Error("Gameboard.addShip(): Cannot create ship; Left position is already taken");
    }
    if (y + 1 < this._boardSize && this.boardMatrix[x][y + 1].hasShip) {
      throw new Error("Gameboard.addShip(): Cannot create ship; Top position is already taken");
    }
    if (y - 1 >= 0 && this.boardMatrix[x][y - 1].hasShip) {
      throw new Error("Gameboard.addShip(): Cannot create ship; Bottom position is already taken");
    }
    if (
      x + 1 < this._boardSize &&
      y + 1 < this._boardSize &&
      this.boardMatrix[x + 1][y + 1].hasShip
    ) {
      throw new Error(
        "Gameboard.addShip(): Cannot create ship; Top right position is already taken"
      );
    }
    if (x + 1 < this._boardSize && y - 1 >= 0 && this.boardMatrix[x + 1][y - 1].hasShip) {
      throw new Error(
        "Gameboard.addShip(): Cannot create ship; Bottom right position is already taken"
      );
    }
    if (x - 1 >= 0 && y + 1 < this._boardSize && this.boardMatrix[x - 1][y + 1].hasShip) {
      throw new Error(
        "Gameboard.addShip(): Cannot create ship; Top left position is already taken"
      );
    }
    if (x - 1 >= 0 && y - 1 >= 0 && this.boardMatrix[x - 1][y - 1].hasShip) {
      throw new Error(
        "Gameboard.addShip(): Cannot create ship; Bottom left position is already taken"
      );
    }
    return true;
  }

  /**
   * Reset the boardMatrix to it's starting state
   */
  resetBoardMatrix() {
    this.boardMatrix.splice(0);
    for (let i = 0; i < this._boardSize; i++) {
      this.boardMatrix[i] = [];
      for (let j = 0; j < this._boardSize; j++) {
        this.boardMatrix[i][j] = { isAttacked: false, hasShip: false };
      }
    }
  }

  /**
   * Attack the specified position
   * @param {Array<number>} position position coordinates between 0 and 9 (inclusive): [x, y]
   * @returns true if cell was not previously attacked, otherwise false
   */
  receiveAttack(position) {
    const pos = { x: position[0], y: position[1] };
    if (this.boardMatrix[pos.x][pos.y].isAttacked) {
      return false;
    }
    this.boardMatrix[pos.x][pos.y].isAttacked = true;

    // if attack hit ship, find and call hit() function on it
    if (this.boardMatrix[pos.x][pos.y].hasShip) {
      for (let ship of this.ships) {
        for (let coordinate of ship.coordinates) {
          if (coordinate[0] === pos.x && coordinate[1] === pos.y) {
            ship.ship.hit();
            return true;
          }
        }
      }
    }
    return true;
  }

  /**
   * Check if all ships on this board have been sunk
   * @returns true if all ships are sunk, otherwise false
   */
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
