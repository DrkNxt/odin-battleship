import * as gameManager from "./gameManager.js";

/**
 * Display main menu
 */
function displayMainMenu() {
  const main = document.querySelector("main");
  main.innerHTML = "";
  const mainMenu = getElement("div", ["main-menu"]);
  const buttonContainer = getElement("div", ["main-buttons"]);

  const buttonSingleplayer = getElement(
    "button",
    ["main-button", "singleplayer"],
    null,
    "Singleplayer"
  );
  const buttonMultiplayer = getElement(
    "button",
    ["main-button", "multiplayer"],
    null,
    "Multiplayer"
  );

  buttonSingleplayer.addEventListener("click", () => {
    gameManager.setMultiplayer(false);
    gameManager.start();
  });

  buttonMultiplayer.addEventListener("click", () => {
    gameManager.setMultiplayer(true);
    gameManager.start();
  });

  buttonContainer.appendChild(buttonSingleplayer);
  buttonContainer.appendChild(buttonMultiplayer);
  mainMenu.appendChild(getElement("h1", ["main-title"], null, "Battleship"));
  mainMenu.appendChild(buttonContainer);
  main.appendChild(mainMenu);
}

/**
 * Display a screen that lets you place your ships on your board
 */
function displayBoardSelection(boardNumber) {
  const main = document.querySelector("main");
  main.innerHTML = "";
  const gameContainer = getElement("div", ["game"]);
  const player = getElement("div", null, `player${boardNumber}`);
  const buttonContainer = getElement("div", ["board-selection-buttons"]);
  const shuffleButton = getElement("button", ["positive"], null, "Shuffle");
  const startButton = getElement("button", ["green"], null, "Start");
  const menuButton = getElement("button", ["negative"], null, "Main Menu");

  startButton.addEventListener("click", () => {
    if (gameManager.isMultiplayer && boardNumber !== 2) {
      displayBoardSelection(2);
    } else {
      gameManager.startGame();
    }
  });

  shuffleButton.addEventListener("click", () => {
    gameManager.randomizeBoard(gameManager.players[boardNumber - 1]);
    generateBoard(gameManager.players[boardNumber - 1], boardNumber);
  });

  menuButton.addEventListener("click", () => {
    displayMainMenu();
  });

  buttonContainer.appendChild(startButton);
  buttonContainer.appendChild(shuffleButton);
  buttonContainer.appendChild(menuButton);
  if (gameManager.isMultiplayer) {
    player.appendChild(getElement("h1", null, null, `Player ${boardNumber}: Place your ships!`));
  } else {
    player.appendChild(getElement("h1", null, null, "Place your ships!"));
  }
  player.appendChild(buttonContainer);
  player.appendChild(getElement("div", ["gameboard"], `board${boardNumber}`));
  gameContainer.appendChild(player);
  main.appendChild(gameContainer);
  gameManager.randomizeBoard(gameManager.players[boardNumber - 1]);
  generateBoard(gameManager.players[boardNumber - 1], boardNumber);
}

/**
 * Load the main game HTML
 */
function displayGame() {
  const main = document.querySelector("main");
  main.innerHTML = "";
  const gameContainer = getElement("div", ["game"]);
  const player1 = getElement("div", null, "player1");
  const player2 = getElement("div", null, "player2");
  const buttonContainer = getElement("div", ["button-container"]);
  const mainButton = getElement("button", ["negative"], null, "Main Menu");

  mainButton.addEventListener("click", () => {
    displayMainMenu();
  });

  player1.appendChild(getElement("h1", null, null, "Your board"));
  player2.appendChild(getElement("h1", null, null, "Enemy board"));
  player1.appendChild(getElement("div", ["gameboard"], "board1"));
  player2.appendChild(getElement("div", ["gameboard"], "board2"));
  gameContainer.appendChild(player1);
  gameContainer.appendChild(player2);
  buttonContainer.appendChild(mainButton);
  main.appendChild(buttonContainer);
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
function displayDialog(
  text,
  positiveAction,
  positiveMessage,
  negativeAction = null,
  negativeMessage = null
) {
  const dialog = document.querySelector("dialog");
  dialog.innerHTML = "";

  // prevent closing with Esc key
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
  });

  const buttonContainer = getElement("div", ["button-container"]);
  const positiveButton = getElement("button", ["positive"], null, positiveMessage);
  positiveButton.addEventListener("click", () => {
    dialog.innerHTML = "";
    dialog.close();
    positiveAction();
  });
  let negativeButton;
  if (negativeAction !== null) {
    negativeButton = getElement("button", ["negative"], null, negativeMessage);
    negativeButton.addEventListener("click", () => {
      dialog.innerHTML = "";
      dialog.close();
      negativeAction();
    });
  }

  buttonContainer.appendChild(positiveButton);
  if (negativeAction !== null) {
    buttonContainer.appendChild(negativeButton);
  }
  dialog.appendChild(getElement("h2", null, null, text));
  dialog.appendChild(buttonContainer);
  dialog.showModal();
}

/**
 * Generate cells as stored in `player.gameboard` on the board specified by `boardNumber`
 * @param {Player} player
 * @param {number} boardNumber 1 or 2
 * @param {Boolean} showShips if true, display ships on board
 * @param {Boolean} isBlank if true, don't display anything on board
 */
function generateBoard(player, boardNumber, showShips = !player.isComputer, isBlank = false) {
  if (boardNumber < 1 || boardNumber > 2) {
    throw (
      new Error() > `domManager.generateBoard: boardNumber has to be 1 or 2 but was ${boardNumber}`
    );
  }

  if (gameManager.isMultiplayer && isBlank) {
    document.querySelector(`#player${boardNumber} > h1`).textContent =
      boardNumber === 1
        ? `Your board ${gameManager.getTurn() === 1 ? "(Player 1)" : "(Player 2)"}`
        : `Enemy board ${gameManager.getTurn() === 1 ? "(Player 2)" : "(Player 1)"}`;
  }

  // generate cells
  const boardContainer = document.querySelector(`#board${boardNumber}`);
  boardContainer.innerHTML = "";
  for (let y = 0; y < player.gameboard._boardSize; y++) {
    for (let x = 0; x < player.gameboard._boardSize; x++) {
      const cell = getElement("div", ["cell", `cell${boardNumber}${x}${y}`]);
      boardContainer.appendChild(cell);

      if (isBlank) {
        continue;
      }

      updateCell([x, y], player, boardNumber, showShips);

      // add click event to each cell
      if (player.isComputer || gameManager.isMultiplayer) {
        cell.addEventListener("click", () => {
          if (
            (gameManager.getTurn() === boardNumber - 1 && !gameManager.isMultiplayer) ||
            (gameManager.isMultiplayer && boardNumber === 1) ||
            gameManager.madeTurn
          ) {
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

function displayPassDevice(turn) {
  displayDialog(
    `Pass the device to Player ${turn === 1 ? 1 : 2}`,
    () => gameManager.nextTurn(true),
    "Continue"
  );
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

export {
  displayMainMenu,
  displayBoardSelection,
  displayGame,
  displayDialog,
  generateBoard,
  updateCell,
  displayTurn,
  displayPassDevice,
};
