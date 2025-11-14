import { Player } from "./classes/player.js";
import * as domManager from "./domManager.js";
import * as comAI from "./comAI.js";

const players = [];
let turn;
let isMultiplayer = false;

/**
 * Start a new singleplayer game
 */
function start() {
  prepareGame();
  domManager.displayBoardSelection(1);
}

/**
 * Prepare everything for board selection
 */
function prepareGame() {
  players.splice(0);
  players.push(new Player(), new Player(!isMultiplayer));
  turn = 0;
}

/**
 * Start main game loop
 */
function startGame() {
  domManager.displayGame();
  domManager.displayTurn(2);

  if (!isMultiplayer) {
    randomizeBoard(players[1], 4, 3, 2, 0, 1);
  }

  domManager.generateBoard(players[0], 1);
  domManager.generateBoard(players[1], 2, isMultiplayer && players[1].isComputer);
}

/**
 * Randomize board with ships of specified lengths
 * @param {Player} player The player whose board to randomize
 * @param {number} length2 Number of ships with length 2
 * @param {number} length3 Number of ships with length 3
 * @param {number} length4 Number of ships with length 4
 * @param {number} length5 Number of ships with length 5
 * @param {number} length6 Number of ships with length 6
 */
function randomizeBoard(
  player,
  length2 = 4,
  length3 = 3,
  length4 = 2,
  length5 = 0,
  length6 = 1,
  maxAttempts = 10
) {
  const shipCounts = [
    { length: 6, count: length6 },
    { length: 5, count: length5 },
    { length: 4, count: length4 },
    { length: 3, count: length3 },
    { length: 2, count: length2 },
  ];

  player.gameboard.resetBoardMatrix();

  let placed = false;

  for (const { length, count } of shipCounts) {
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      const maxShipAttempts = 100;
      placed = false;

      while (!placed && attempts < maxShipAttempts) {
        attempts++;

        // random position (0-9)
        const x = Math.floor(Math.random() * player.gameboard._boardSize);
        const y = Math.floor(Math.random() * player.gameboard._boardSize);

        // random orientation (true = horizontal, false = vertical)
        const placeHorizontally = Math.random() < 0.5;

        try {
          player.gameboard.addShip(length, [x, y], placeHorizontally);
          placed = true;
        } catch (error) {
          // position was invalid or already taken, try again
        }
      }

      if (!placed) {
        break;
      }
    }
    if (!placed) {
      break;
    }
  }

  if (!placed) {
    if (maxAttempts <= 1) {
      console.warn("Could not find valid board");
      return;
    }
    randomizeBoard(player, length2, length3, length4, length5, length6, maxAttempts - 1);
  }
}

/**
 * Set turn to next turn
 */
async function nextTurn(isDevicePassed = false) {
  if (isMultiplayer && !isDevicePassed) {
    await wait(1000);
    domManager.displayPassDevice(turn);
    domManager.generateBoard(players[0], 1, false, true);
    domManager.generateBoard(players[1], 2, false, true);
    return;
  }
  if (turn !== 0) {
    turn = 0;
    if (isMultiplayer) {
      domManager.generateBoard(players[0], 1);
      domManager.generateBoard(players[1], 2, false);
    }
    domManager.displayTurn(2);
  } else {
    turn = 1;
    if (!isMultiplayer) {
      domManager.displayTurn(1);
      comAI.turn(players[0]);
    } else {
      domManager.generateBoard(players[1], 1);
      domManager.generateBoard(players[0], 2, false);
    }
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
      () => start(),
      "Play again",
      () => domManager.displayMainMenu(),
      "Main Menu"
    );
  }
  if (players[1].gameboard.allShipsSunk()) {
    domManager.displayDialog(
      "You win!",
      () => start(),
      "Play again",
      () => domManager.displayMainMenu(),
      "Main Menu"
    );
  }
}

/**
 * Set `isMultiplayer` to `bool`
 * @param {Boolean} bool
 */
function setMultiplayer(bool) {
  isMultiplayer = bool;
}

/**
 * Pause function execution for `delay` milliseconds
 * @param {number} delay
 * @returns
 */
function wait(delay) {
  return new Promise((resolve) => setTimeout(() => resolve(null), delay));
}

domManager.displayMainMenu();

export {
  nextTurn,
  getTurn,
  isGameOver,
  start,
  startGame,
  randomizeBoard,
  setMultiplayer,
  wait,
  players,
  isMultiplayer,
};

// TODO: Anzeige welche spieler dran ist.
// Fixen das player swap den richtigen spieler anzeigt
// Den Screen blocken, nachdem Spieler 2 sein Board gewählt hat
