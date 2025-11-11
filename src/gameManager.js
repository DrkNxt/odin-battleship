import { Ship } from "./classes/ship.js";
import { Gameboard } from "./classes/gameboard.js";
import { Player } from "./classes/player.js";
import * as domManager from "./domManager.js";

const player = new Player();
const com = new Player(true);

player.gameboard.addShip(4, [1, 1]);
player.gameboard.addShip(3, [4, 3], false);
player.gameboard.addShip(3, [6, 2]);
player.gameboard.addShip(3, [7, 5]);

com.gameboard.addShip(4, [9, 3]);
com.gameboard.addShip(3, [3, 4]);
com.gameboard.addShip(3, [5, 6], false);
com.gameboard.addShip(3, [7, 5], false);

player.gameboard.receiveAttack([0, 0]);
player.gameboard.receiveAttack([1, 1]);

domManager.generateBoard(player, 1);
domManager.generateBoard(com, 2);
