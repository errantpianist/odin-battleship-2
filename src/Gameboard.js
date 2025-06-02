// Gameboard.js
class Gameboard {
  constructor() {
    // Create a 10x10 grid initialized to null
    this.grid = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    this.ships = [];
    this.missedAttacks = [];
    this.hitAttacks = [];
  }

  // In src/Gameboard.js

  placeShip(ship, [startY, startX], direction) {
    // 1. Check for out of bounds
    if (direction === 'horizontal' && startX + ship.length > 10) {
      return false;
    }
    if (direction === 'vertical' && startY + ship.length > 10) {
      return false;
    }

    // 2. Check for overlaps
    const coordinates = [];
    for (let i = 0; i < ship.length; i++) {
      const y = direction === 'vertical' ? startY + i : startY;
      const x = direction === 'horizontal' ? startX + i : startX;
      if (this.grid[y][x] !== null) {
        return false; // Found an overlapping ship
      }
      coordinates.push({ y, x });
    }

    // 3. If all checks pass, place the ship
    coordinates.forEach(({ y, x }) => {
      this.grid[y][x] = ship;
    });

    this.ships.push(ship);
    return true;
  }

  receiveAttack([y, x]) {
    // Check if this coordinate has already been attacked
    const hasBeenHit = this.hitAttacks.some(
      (coord) => coord[0] === y && coord[1] === x
    );
    const hasBeenMissed = this.missedAttacks.some(
      (coord) => coord[0] === y && coord[1] === x
    );

    if (hasBeenHit || hasBeenMissed) {
      return false;
    }

    const target = this.grid[y][x];

    if (target === null) {
      // It's a miss
      this.missedAttacks.push([y, x]);
    } else {
      // It's a hit on a ship
      target.hit();
      this.hitAttacks.push([y, x]);
    }
  }

  areAllShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}

export default Gameboard;
