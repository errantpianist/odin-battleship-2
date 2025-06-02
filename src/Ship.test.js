// Ship.test.js
import Ship from './Ship'; // We assume the file is named Ship.js

test('Ship class creates a ship object with the correct length', () => {
  const ship = new Ship(3); // Create a ship of length 3
  expect(ship.length).toBe(3);
});

test('Ship class creates a ship object with the correct hits', () => {
  const ship = new Ship(3);
  expect(ship.hits).toBe(0);
});

test('Ship class increments hits correctly', () => {
  const ship = new Ship(3);
  ship.hit();
  expect(ship.hits).toBe(1);
});

test('Ship class increments hits multiple times', () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  expect(ship.hits).toBe(2);
});

test('Ship class cannot have hits greater than length', () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  ship.hit(); // Attempt to hit more than its length
  expect(ship.hits).toBe(3); // Assuming the ship can only be hit up to its length
});

test('isSunk returns false for new ship', () => {
  const ship = new Ship(3);
  expect(ship.isSunk()).toBe(false);
});

test('isSunk() returns true after being hit length times', () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
