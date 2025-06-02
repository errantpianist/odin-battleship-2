// Gameboard.test.js
import Gameboard from './Gameboard';
import Ship from './Ship';

describe('Gameboard', () => {
  let gameboard;

  beforeEach(() => {
    // Create a new gameboard before each test
    gameboard = new Gameboard();
  });

  test('can place a ship at specific coordinates horizontally', () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, [0, 0], 'horizontal');

    expect(gameboard.grid[0][0]).toBe(ship);
    expect(gameboard.grid[0][1]).toBe(ship);
    expect(gameboard.grid[0][2]).toBe(ship);
    expect(gameboard.grid[0][3]).toBe(null); // Check adjacent cell is empty
  });

  test('can place a ship at specific coordinates vertically', () => {
    const ship = new Ship(4);
    gameboard.placeShip(ship, [2, 3], 'vertical');
    expect(gameboard.grid[2][3]).toBe(ship);
    expect(gameboard.grid[3][3]).toBe(ship);
    expect(gameboard.grid[4][3]).toBe(ship);
    expect(gameboard.grid[5][3]).toBe(ship);
    expect(gameboard.grid[6][3]).toBe(null);
    expect(gameboard.grid[2][4]).toBe(null);
  });

  test('receiveAttack calls hit() on the correct ship', () => {
    const ship = new Ship(3);
    ship.hit = jest.fn(); // Replace the original hit method with a mock

    gameboard.placeShip(ship, [0, 0], 'horizontal');
    gameboard.receiveAttack([0, 1]);

    // Assert that the mock 'hit' function was called
    expect(ship.hit).toHaveBeenCalled();
  });

  test('receiveAttack records coordinates of missed shots', () => {
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([5, 5]);
    expect(gameboard.missedAttacks).toContainEqual([0, 0]);
    expect(gameboard.missedAttacks).toContainEqual([5, 5]);
  });

  test('receiveAttack does not record a miss if it hits a ship', () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, [0, 0], 'horizontal');
    gameboard.receiveAttack([0, 1]);
    expect(gameboard.missedAttacks.length).toBe(0);
  });

  test('areAllShipsSunk reports false if not all ships are sunk', () => {
    const ship1 = new Ship(2);
    const ship2 = new Ship(1);
    gameboard.placeShip(ship1, [0, 0], 'horizontal');
    gameboard.placeShip(ship2, [1, 0], 'horizontal');

    // Sink ship1 but not ship2
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 1]);

    expect(gameboard.areAllShipsSunk()).toBe(false);
  });

  test('areAllShipsSunk reports true if all ships are sunk', () => {
    const ship1 = new Ship(2);
    const ship2 = new Ship(1);
    gameboard.placeShip(ship1, [0, 0], 'horizontal');
    gameboard.placeShip(ship2, [1, 0], 'horizontal');

    // Sink both ships
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 1]);
    gameboard.receiveAttack([1, 0]);

    expect(gameboard.areAllShipsSunk()).toBe(true);
  });

  test('does not allow attacking the same coordinate twice (hit)', () => {
    const ship = new Ship(2);
    gameboard.placeShip(ship, [0, 0], 'horizontal');

    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 0]); // Attack the same spot again

    expect(ship.hits).toBe(1);
  });

  test('does not allow attacking the same coordinate twice (miss)', () => {
    gameboard.receiveAttack([5, 5]);
    gameboard.receiveAttack([5, 5]); // Attack the same spot again

    // We expect only one record of the missed attack
    expect(gameboard.missedAttacks.length).toBe(1);
  });

  test('placeShip prevents placing ships out of bounds (horizontal)', () => {
    const ship = new Ship(4);
    // Try to place a ship of length 4 starting at x=8. It won't fit.
    expect(gameboard.placeShip(ship, [0, 8], 'horizontal')).toBe(false);
  });

  test('placeShip prevents placing ships out of bounds (vertical)', () => {
    const ship = new Ship(4);
    // Try to place a ship of length 4 starting at y=8. It won't fit.
    expect(gameboard.placeShip(ship, [8, 0], 'vertical')).toBe(false);
  });

  test('placeShip prevents placing ships on top of other ships', () => {
    const ship1 = new Ship(3);
    const ship2 = new Ship(3);
    gameboard.placeShip(ship1, [0, 0], 'horizontal');
    // Try to place ship2 overlapping ship1
    expect(gameboard.placeShip(ship2, [0, 2], 'horizontal')).toBe(false);
  });
});
