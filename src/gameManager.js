import { Player } from "./classes/player.js";
import * as domManager from "./domManager.js";
import * as comAI from "./comAI.js";

const players = [];
let turn;

/**
 * Display ship placement screen
 */
function prepareGame() {
  players.splice(0);
  players.push(new Player(), new Player(true));
  turn = 0;
  startGame();
}

/**
 * Start main game loop
 */
function startGame() {
  domManager.displayGame();
  domManager.displayGame();
  domManager.displayTurn(2);

  players[0].gameboard.addShip(4, [1, 1]);
  players[0].gameboard.addShip(3, [4, 3], false);
  players[0].gameboard.addShip(3, [6, 2]);
  players[0].gameboard.addShip(3, [7, 5]);

  players[1].gameboard.addShip(4, [9, 3]);
  players[1].gameboard.addShip(3, [3, 4]);
  players[1].gameboard.addShip(3, [5, 6], false);
  players[1].gameboard.addShip(3, [7, 5], false);

  domManager.generateBoard(players[0], 1);
  domManager.generateBoard(players[1], 2);
}

/**
 * Set turn to next turn
 */
function nextTurn() {
  if (turn !== 0) {
    turn = 0;
    domManager.displayTurn(2);
  } else {
    turn = 1;
    domManager.displayTurn(1);
    comAI.turn(players[0]);
  }
}

/**
 * Get the active turn
 * @returns `turn`
 */
function getTurn() {
  return turn;
}

/**
 * Check if all of the ships of one board are sunk
 */
function isGameOver() {
  if (players[0].gameboard.allShipsSunk()) {
    domManager.displayDialog(
      "You lose!",
      () => console.log("positive"),
      "Play again",
      () => console.log("negative"),
      "Main Menu"
    );
  }
  if (players[1].gameboard.allShipsSunk()) {
    domManager.displayDialog(
      "You win!",
      () => console.log("positive"),
      "Play again",
      () => console.log("negative"),
      "Main Menu"
    );
  }
}

prepareGame();

export { nextTurn, getTurn, isGameOver };
