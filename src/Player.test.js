// Player.test.js
import Player from './Player';
import Gameboard from './Gameboard';

describe('Player', () => {
  test('creates a player with a given type', () => {
    const player = new Player('human');
    expect(player.type).toBe('human');
  });

  test('player has their own gameboard', () => {
    const player = new Player('human');
    expect(player.gameboard).toBeInstanceOf(Gameboard);
  });

  test('attack method calls receiveAttack on the opponent board', () => {
    const player1 = new Player('human');
    const opponent = new Player('computer');

    // Spy on the opponent's gameboard's receiveAttack method
    opponent.gameboard.receiveAttack = jest.fn();

    const coords = [1, 2];
    player1.attack(coords, opponent);

    // Check if the spy was called with the right arguments
    expect(opponent.gameboard.receiveAttack).toHaveBeenCalledWith(coords);
  });

  test('computer makes a random, valid attack', () => {
    const computerPlayer = new Player('computer');
    const opponent = new Player('human');

    // Spy on the opponent's receiveAttack method
    opponent.gameboard.receiveAttack = jest.fn();

    // Manually create a list of all 100 coordinates
    const allCoords = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        allCoords.push([y, x]);
      }
    }

    // "Attack" the first 99 coordinates, leaving only [9, 9]
    const lastCoord = allCoords.pop();
    opponent.gameboard.hitAttacks = allCoords;

    computerPlayer.makeRandomAttack(opponent);

    // Expect the computer to have chosen the only valid spot left
    expect(opponent.gameboard.receiveAttack).toHaveBeenCalledWith(lastCoord);
  });
});
