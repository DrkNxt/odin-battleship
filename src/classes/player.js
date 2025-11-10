import { Gameboard } from "./gameboard.js";

class Player {
  constructor(isComputer) {
    this.isComputer = isComputer;
    this.gameboard = new Gameboard();
  }
}

export { Player };
