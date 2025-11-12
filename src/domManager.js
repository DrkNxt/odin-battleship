import * as gameManager from "./gameManager.js";

/**
 * Generate cells as stored in `player.gameboard` on the board specified by `boardNumber`
 * @param {Player} player
 * @param {number} boardNumber 1 or 2
 */
function generateBoard(player, boardNumber) {
  if (boardNumber < 1 || boardNumber > 2) {
    throw (
      new Error() > `domManager.generateBoard: boardNumber has to be 1 or 2 but was ${boardNumber}`
    );
  }

  // generate cells
  const boardContainer = document.querySelector(`#board${boardNumber}`);
  for (let i = 0; i < player.gameboard._boardSize; i++) {
    for (let j = 0; j < player.gameboard._boardSize; j++) {
      const cell = document.createElement("div");
      // add cell number to class
      cell.classList.add("cell", `cell${boardNumber}${i}${j}`);
      boardContainer.appendChild(cell);
      updateCell([i, j], player, boardNumber, !player.isComputer);

      // add click event to each cell
      if (player.isComputer) {
        cell.addEventListener("click", () => {
          if (gameManager.getTurn() === boardNumber - 1) {
            return;
          }

          // make sure clicked cell has not been clicked before
          if (player.gameboard.receiveAttack([i, j])) {
            updateCell([i, j], player, boardNumber);

            // let player attack again if attack hit a ship
            if (!player.gameboard.boardMatrix[i][j].hasShip) {
              gameManager.nextTurn();
            }
          }
        });
      }
    }
  }
}

/**
 * Update the specified `cell` as stored in `player.gameboard` on the board specified by `boardNumber`
 * @param {Array<number>} position cell coordinates between 0 and 9 (inclusive): [x, y]
 * @param {*} player
 * @param {*} boardNumber 1 or 2
 */
function updateCell(position, player, boardNumber, showShips = false) {
  if (boardNumber < 1 || boardNumber > 2) {
    throw (
      new Error() > `domManager.updateCell: boardNumber has to be 1 or 2 but was ${boardNumber}`
    );
  }

  const pos = { x: position[0], y: position[1] };
  const cellData = player.gameboard.boardMatrix[pos.x][pos.y];
  const cellContainer = document.querySelector(`.cell${boardNumber}${pos.x}${pos.y}`);

  cellContainer.classList.remove("hit", "miss", "ship");

  if (cellData.isAttacked) {
    if (cellData.hasShip) {
      cellContainer.classList.add("hit");
    } else {
      cellContainer.classList.add("miss");
    }
  } else if (showShips && cellData.hasShip) {
    cellContainer.classList.add("ship");
  }
}

export { generateBoard, updateCell };
