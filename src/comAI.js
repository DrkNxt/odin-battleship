import * as gameManager from "./gameManager.js";
import * as domManager from "./domManager.js";

const possibleMoves = [];
const preferredMoves = [];

/**
 * Get an Array of all possible moves
 * @param {Player} player
 * @param {Array<number>} array
 */
function getPossibleMoves(player, array) {
  for (let i = 0; i < player.gameboard._boardSize; i++) {
    for (let j = 0; j < player.gameboard._boardSize; j++) {
      if (!player.gameboard.boardMatrix[i][j].isAttacked) {
        array.push([i, j]);
      }
    }
  }
}

/**
 * Let the computer take their turn
 * @param {Player} player Player to attack
 */
async function turn(player) {
  if (possibleMoves.length < 1) {
    getPossibleMoves(player, possibleMoves);
  }

  while (gameManager.getTurn() !== 0) {
    // choose a possible move at random
    let move;
    let chosePreferred = false;
    if (preferredMoves.length > 0) {
      move = preferredMoves[Math.floor(Math.random() * preferredMoves.length)];
      preferredMoves.splice(
        preferredMoves.findIndex((m) => m === move),
        1
      );
      possibleMoves.splice(
        possibleMoves.findIndex((m) => JSON.stringify(m) == JSON.stringify(move)),
        1
      );
      chosePreferred = true;
    } else {
      move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      possibleMoves.splice(
        possibleMoves.findIndex((m) => m === move),
        1
      );
    }

    // add delay
    await gameManager.wait(400);

    player.gameboard.receiveAttack([move[0], move[1]]);
    domManager.updateCell([move[0], move[1]], player, 1);

    gameManager.isGameOver();

    // attack again if attack hit a ship
    if (player.gameboard.boardMatrix[move[0]][move[1]].hasShip) {
      let boardSize = player.gameboard._boardSize;

      // check for multiple hits in same row/column
      // row
      if (
        (move[0] + 1 < boardSize &&
          player.gameboard.boardMatrix[move[0] + 1][move[1]].hasShip &&
          player.gameboard.boardMatrix[move[0] + 1][move[1]].isAttacked) ||
        (move[0] - 1 >= 0 &&
          player.gameboard.boardMatrix[move[0] - 1][move[1]].hasShip &&
          player.gameboard.boardMatrix[move[0] - 1][move[1]].isAttacked)
      ) {
        // add next cells in same row to preferredMoves and remove everything else
        preferredMoves.splice(0);
        // search for next not attacked cell on right side
        for (let i = move[0] + 1; i < boardSize; i++) {
          if (!player.gameboard.boardMatrix[i][move[1]].isAttacked) {
            preferredMoves.push([i, move[1]]);
            break;
          } else if (!player.gameboard.boardMatrix[i][move[1]].hasShip) {
            break;
          }
        }
        // search for next not attacked cell on left side
        for (let i = move[0] - 1; i >= 0; i--) {
          if (!player.gameboard.boardMatrix[i][move[1]].isAttacked) {
            preferredMoves.push([i, move[1]]);
            break;
          } else if (!player.gameboard.boardMatrix[i][move[1]].hasShip) {
            break;
          }
        }
        continue;
      }

      // column
      if (
        (move[1] + 1 < boardSize &&
          player.gameboard.boardMatrix[move[0]][move[1] + 1].hasShip &&
          player.gameboard.boardMatrix[move[0]][move[1] + 1].isAttacked) ||
        (move[1] - 1 >= 0 &&
          player.gameboard.boardMatrix[move[0]][move[1] - 1].hasShip &&
          player.gameboard.boardMatrix[move[0]][move[1] - 1].isAttacked)
      ) {
        // add next cells in same column to preferredMoves and remove everything else
        preferredMoves.splice(0);
        // search for next not attacked cell on right side
        for (let i = move[1] + 1; i < boardSize; i++) {
          if (!player.gameboard.boardMatrix[move[0]][i].isAttacked) {
            preferredMoves.push([move[0], i]);
            break;
          } else if (!player.gameboard.boardMatrix[move[0]][i].hasShip) {
            break;
          }
        }
        // search for next not attacked cell on left side
        for (let i = move[1] - 1; i >= 0; i--) {
          if (!player.gameboard.boardMatrix[move[0]][i].isAttacked) {
            preferredMoves.push([move[0], i]);
            break;
          } else if (!player.gameboard.boardMatrix[move[0]][i].hasShip) {
            break;
          }
        }
        continue;
      }

      if (chosePreferred && preferredMoves.length < 1) {
        continue;
      }

      // check directions
      // up
      if (
        move[1] + 1 < boardSize &&
        !player.gameboard.boardMatrix[move[0]][move[1] + 1].isAttacked
      ) {
        preferredMoves.push([move[0], move[1] + 1]);
      }

      // right
      if (
        move[0] + 1 < boardSize &&
        !player.gameboard.boardMatrix[move[0] + 1][move[1]].isAttacked
      ) {
        preferredMoves.push([move[0] + 1, move[1]]);
      }

      // down
      if (move[1] - 1 >= 0 && !player.gameboard.boardMatrix[move[0]][move[1] - 1].isAttacked) {
        preferredMoves.push([move[0], move[1] - 1]);
      }

      // left
      if (move[0] - 1 >= 0 && !player.gameboard.boardMatrix[move[0] - 1][move[1]].isAttacked) {
        preferredMoves.push([move[0] - 1, move[1]]);
      }
      continue;
    }

    gameManager.nextTurn();
  }
}

export { turn };
