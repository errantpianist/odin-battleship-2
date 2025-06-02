// src/index.js
import './styles.css';
import Player from './Player';
import Ship from './Ship';
import { renderBoard, updateStatus, showWinner } from './dom';

// --- Game State Management ---
const gameState = {
  player: new Player('human'),
  computer: new Player('computer'),
  currentPlayer: null,
  isGameOver: false,
  placement: {
    shipsToPlace: [
      { name: 'Carrier', length: 5 },
      { name: 'Battleship', length: 4 },
      { name: 'Cruiser', length: 3 },
      { name: 'Submarine', length: 3 },
      { name: 'Destroyer', length: 2 },
    ],
    currentShipIndex: 0,
    direction: 'horizontal',
  },
};

// --- DOM Element References ---
const placementControls = document.getElementById('placement-controls');
const placementStatus = document.getElementById('placement-status');
const rotateButton = document.getElementById('rotate-ship');
const computerBoardElement =
  document.getElementById('computer-board').parentElement;

// --- Placement Phase Logic ---

function handlePlacementClick(e) {
  const y = parseInt(e.target.dataset.y, 10);
  const x = parseInt(e.target.dataset.x, 10);
  const shipInfo =
    gameState.placement.shipsToPlace[gameState.placement.currentShipIndex];

  const ship = new Ship(shipInfo.length);
  const placedSuccessfully = gameState.player.gameboard.placeShip(
    ship,
    [y, x],
    gameState.placement.direction
  );

  if (placedSuccessfully) {
    gameState.placement.currentShipIndex++;
    renderBoards(true);
    updatePlacementInstructions();
  } else {
    updateStatus('Invalid placement! Try again.');
    setTimeout(() => {
      updateStatus(''); // Clear status after a short delay
    }, 2000);
  }
}

function updatePlacementInstructions() {
  if (
    gameState.placement.currentShipIndex >=
    gameState.placement.shipsToPlace.length
  ) {
    endPlacementPhase();
    return;
  }
  const shipInfo =
    gameState.placement.shipsToPlace[gameState.placement.currentShipIndex];
  placementStatus.textContent = `Place your ${shipInfo.name} (length ${shipInfo.length})`;
}

function rotateShip() {
  gameState.placement.direction =
    gameState.placement.direction === 'horizontal' ? 'vertical' : 'horizontal';
  rotateButton.textContent = `Rotate Ship (Current: ${gameState.placement.direction})`;
}

function initPlacementPhase() {
  placementControls.style.display = 'flex';
  computerBoardElement.style.display = 'none';
  rotateButton.addEventListener('click', rotateShip);
  updateStatus('');
  updatePlacementInstructions();
  renderBoards(true);
}

function endPlacementPhase() {
  placementControls.style.display = 'none';
  computerBoardElement.style.display = 'block';
  startGame();
}

function startGame() {
  // Place computer's ships randomly
  placeRandomShips(gameState.computer);

  gameState.currentPlayer = gameState.player;
  gameState.isGameOver = false;
  renderBoards();
  updateStatus('Your turn! Attack the enemy board.');
}

function placeRandomShips(player) {
  const shipLengths = [5, 4, 3, 3, 2];
  shipLengths.forEach((length) => {
    let placed = false;
    while (!placed) {
      const y = Math.floor(Math.random() * 10);
      const x = Math.floor(Math.random() * 10);
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      placed = player.gameboard.placeShip(new Ship(length), [y, x], direction);
    }
  });
}

function handlePlayerAttack(e) {
  if (gameState.isGameOver || gameState.currentPlayer !== gameState.player)
    return;
  const y = parseInt(e.target.dataset.y, 10);
  const x = parseInt(e.target.dataset.x, 10);
  const attackSuccessful = gameState.computer.gameboard.receiveAttack([y, x]);

  if (attackSuccessful === false) return;

  renderBoards();
  if (checkForWinner()) return;
  switchTurn();
}

function handleComputerTurn() {
  updateStatus("Computer's turn...");
  setTimeout(() => {
    gameState.computer.makeRandomAttack(gameState.player);
    renderBoards();
    if (checkForWinner()) return;
    switchTurn();
  }, 500);
}

function switchTurn() {
  if (gameState.isGameOver) return;
  gameState.currentPlayer =
    gameState.currentPlayer === gameState.player
      ? gameState.computer
      : gameState.player;
  if (gameState.currentPlayer === gameState.computer) {
    handleComputerTurn();
  } else {
    updateStatus('Your turn!');
  }
}

function checkForWinner() {
  if (gameState.computer.gameboard.areAllShipsSunk()) {
    gameState.isGameOver = true;
    showWinner('Player');
    return true;
  }
  if (gameState.player.gameboard.areAllShipsSunk()) {
    gameState.isGameOver = true;
    showWinner('The Computer');
    return true;
  }
  return false;
}

function clearPreviews() {
  const previewCells = document.querySelectorAll('.preview, .preview-invalid');
  previewCells.forEach((cell) => {
    cell.classList.remove('preview', 'preview-invalid');
  });
}

function handlePlacementHover(e) {
  clearPreviews(); // Clear any previous previews first

  const y = parseInt(e.target.dataset.y, 10);
  const x = parseInt(e.target.dataset.x, 10);
  const shipInfo =
    gameState.placement.shipsToPlace[gameState.placement.currentShipIndex];

  if (!shipInfo) return; // All ships placed

  let isValid = true;
  const cellsToPreview = [];

  for (let i = 0; i < shipInfo.length; i++) {
    let currentY = y;
    let currentX = x;
    if (gameState.placement.direction === 'horizontal') {
      currentX += i;
    } else {
      currentY += i;
    }

    // Check for out of bounds
    if (currentX > 9 || currentY > 9) {
      isValid = false;
    }
    // Check for overlaps with already placed ships
    if (
      isValid &&
      gameState.player.gameboard.grid[currentY][currentX] !== null
    ) {
      isValid = false;
    }

    const cell = document.querySelector(
      `[data-y='${currentY}'][data-x='${currentX}']`
    );
    if (cell) {
      cellsToPreview.push(cell);
    }
  }

  // Apply the appropriate class to all segments of the ghost ship
  cellsToPreview.forEach((cell) => {
    cell.classList.add(isValid ? 'preview' : 'preview-invalid');
  });
}

function renderBoards(isPlacementPhase = false) {
  let playerHandlers = {};
  let computerHandlers = {};

  if (isPlacementPhase) {
    playerHandlers = {
      click: handlePlacementClick,
      mouseover: handlePlacementHover,
      mouseout: clearPreviews,
    };
  } else {
    computerHandlers = {
      click: handlePlayerAttack,
    };
  }

  renderBoard(
    gameState.player.gameboard,
    'player-board',
    playerHandlers,
    'human'
  );
  renderBoard(
    gameState.computer.gameboard,
    'computer-board',
    computerHandlers,
    'computer'
  );
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', initPlacementPhase);
