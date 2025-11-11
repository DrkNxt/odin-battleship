import { Gameboard } from "./gameboard.js";

class Player {
  /**
   * Create a new Player object
   * @param {boolean} isComputer
   */
  constructor(isComputer = false) {
    this.isComputer = isComputer;
    this.gameboard = new Gameboard();
  }
}

export { Player };
