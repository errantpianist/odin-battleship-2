// src/dom.js

/**
 * Renders a single game board.
 * @param {Gameboard} gameboardObject - The gameboard object to render.
 * @param {string} boardId - The ID of the container element for the board.
 * @param {object} handlers - Object containing event handlers for cells
 * @param {string} playerType - 'human' or 'computer' to determine board behavior.
 */
export function renderBoard(gameboardObject, boardId, handlers, playerType) {
  const boardElement = document.getElementById(boardId);
  if (!boardElement) return; // Safety check

  // Clear the board first
  boardElement.innerHTML = '';
  boardElement.className =
    playerType === 'human' ? 'gameboard player-board' : 'gameboard enemy-board';

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.y = y;
      cell.dataset.x = x;

      const isHit = gameboardObject.hitAttacks.some(
        (c) => c[0] === y && c[1] === x
      );
      const isMiss = gameboardObject.missedAttacks.some(
        (c) => c[0] === y && c[1] === x
      );

      if (isHit) {
        cell.classList.add('hit');
      } else if (isMiss) {
        cell.classList.add('miss');
      } else if (
        playerType === 'human' &&
        gameboardObject.grid[y][x] !== null
      ) {
        cell.classList.add('ship');
      }

      if (handlers.click) {
        cell.addEventListener('click', handlers.click);
      }
      if (handlers.mouseover) {
        cell.addEventListener('mouseover', handlers.mouseover);
      }
      if (handlers.mouseout) {
        cell.addEventListener('mouseout', handlers.mouseout);
      }

      boardElement.appendChild(cell);
    }
  }
}

/**
 * Updates the game status message.
 * @param {string} message
 */
export function updateStatus(message) {
  const statusElement = document.getElementById('game-status');
  if (statusElement) {
    statusElement.textContent = message;
  }
}

/**
 * Displays the winner and ends the game.
 * @param {string} winnerName
 */
export function showWinner(winnerName) {
  updateStatus(`${winnerName} wins!`);
  const computerBoardElement = document.getElementById('computer-board');
  if (computerBoardElement) {
    // Disable further clicks on the opponent's board
    computerBoardElement.style.pointerEvents = 'none';
  }
}
