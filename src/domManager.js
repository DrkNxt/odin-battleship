import * as gameManager from "./gameManager.js";

/**
 * Load the main game HTML
 */
function displayGame() {
  const main = document.querySelector("main");
  main.innerHTML = "";
  const gameContainer = getElement("div", ["game"]);
  const player1 = getElement("div", null, "player1");
  const player2 = getElement("div", null, "player2");

  player1.appendChild(getElement("h1", null, null, "Your board"));
  player2.appendChild(getElement("h1", null, null, "Enemy board"));
  player1.appendChild(getElement("div", ["gameboard"], "board1"));
  player2.appendChild(getElement("div", ["gameboard"], "board2"));
  gameContainer.appendChild(player1);
  gameContainer.appendChild(player2);
  main.appendChild(gameContainer);
}

/**
 * Display a new dialog with two options
 * @param {String} text
 * @param {Function} positiveAction
 * @param {String} positiveMessage
 * @param {Function} negativeAction
 * @param {String} negativeMessage
 */
function displayDialog(text, positiveAction, positiveMessage, negativeAction, negativeMessage) {
  const dialog = document.querySelector("dialog");
  dialog.innerHTML = "";

  // prevent closing with Esc key
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
  });

  const positiveButton = getElement("button", ["positive"], null, positiveMessage);
  positiveButton.addEventListener("click", () => {
    dialog.innerHTML = "";
    dialog.close();
    positiveAction();
  });

  const negativeButton = getElement("button", ["negative"], null, negativeMessage);
  negativeButton.addEventListener("click", () => {
    dialog.innerHTML = "";
    dialog.close();
    negativeAction();
  });

  dialog.appendChild(getElement("h2", null, null, text));
  dialog.appendChild(positiveButton);
  dialog.appendChild(negativeButton);
  dialog.showModal();
}

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
  for (let y = 0; y < player.gameboard._boardSize; y++) {
    for (let x = 0; x < player.gameboard._boardSize; x++) {
      const cell = getElement("div", ["cell", `cell${boardNumber}${x}${y}`]);
      boardContainer.appendChild(cell);
      updateCell([x, y], player, boardNumber, !player.isComputer);

      // add click event to each cell
      if (player.isComputer) {
        cell.addEventListener("click", () => {
          if (gameManager.getTurn() === boardNumber - 1) {
            return;
          }

          // make sure clicked cell has not been clicked before
          if (player.gameboard.receiveAttack([x, y])) {
            updateCell([x, y], player, boardNumber);
            gameManager.isGameOver();

            // let player attack again if attack hit a ship
            if (!player.gameboard.boardMatrix[x][y].hasShip) {
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
 * @param {Player} player
 * @param {number} boardNumber 1 or 2
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

/**
 * Display who's turn it is
 * @param {number} boardNumber 1 or 2
 */
function displayTurn(boardNumber) {
  if (boardNumber < 1 || boardNumber > 2) {
    throw (
      new Error() > `domManager.displayTurn: boardNumber has to be 1 or 2 but was ${boardNumber}`
    );
  }

  const board1 = document.querySelector("#board1");
  const board2 = document.querySelector("#board2");

  if (boardNumber === 1) {
    board1.classList.add("active");
    board2.classList.remove("active");
  } else {
    board2.classList.add("active");
    board1.classList.remove("active");
  }
}

/**
 * Get a new HTML element
 * @param {K} element
 * @param {Array<String>} classes
 * @param {string} id
 * @returns The created HTML element
 */
function getElement(element, classes = null, id = null, text = null) {
  const newElement = document.createElement(element);
  if (classes !== null) {
    newElement.classList.add(...classes);
  }
  if (id !== null) {
    newElement.id = id;
  }
  if (text !== null) {
    newElement.textContent = text;
  }
  return newElement;
}

export { displayGame, displayDialog, generateBoard, updateCell, displayTurn };
