import { Player } from "./classes/player.js";
import * as domManager from "./domManager.js";

const players = [new Player(), new Player(true)];
let turn = 0;
const comPossibleMoves = getPossibleMoves(players[1]);
domManager.displayTurn(2);

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
    comTurn();
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
 * Get an Array of all possible moves
 * @param {Player} player
 */
function getPossibleMoves(player) {
  const moves = [];
  for (let i = 0; i < player.gameboard._boardSize; i++) {
    for (let j = 0; j < player.gameboard._boardSize; j++) {
      if (!player.gameboard.boardMatrix[i][j].isAttacked) {
        moves.push([i, j]);
      }
    }
  }
  return moves;
}

/**
 * Let the computer take their turn
 */
async function comTurn() {
  while (getTurn() !== 0) {
    // choose a possible move at random
    let move = comPossibleMoves[Math.floor(Math.random() * comPossibleMoves.length)];
    comPossibleMoves.splice(
      comPossibleMoves.findIndex((m) => m === move),
      1
    );

    // add delay
    await wait(400);

    players[0].gameboard.receiveAttack([move[0], move[1]]);
    domManager.updateCell([move[0], move[1]], players[0], 1);

    isGameOver();

    // attack again if attack hit a ship
    if (players[0].gameboard.boardMatrix[move[0]][move[1]].hasShip) {
      continue;
    }

    nextTurn();
  }
}

/**
 * Pause function execution for `delay` milliseconds
 * @param {number} delay
 * @returns
 */
function wait(delay) {
  return new Promise((resolve) => setTimeout(() => resolve(null), delay));
}

/**
 * Check if all of the ships of one board are sunk
 */
function isGameOver() {
  if (players[0].gameboard.allShipsSunk()) {
    console.log("You lose");
  }
  if (players[1].gameboard.allShipsSunk()) {
    console.log("You win!");
  }
}

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

export { nextTurn, getTurn, isGameOver };
