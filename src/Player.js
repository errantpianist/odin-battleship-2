// Player.js
import Gameboard from './Gameboard';

class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();
  }

  attack(coords, opponent) {
    opponent.gameboard.receiveAttack(coords);
  }

  makeRandomAttack(opponent) {
    if (this.type !== 'computer') return; // Only computers can do this

    let y, x;
    let moveIsValid = false;

    // Keep generating random coordinates until a valid, un-attacked spot is found
    while (!moveIsValid) {
      y = Math.floor(Math.random() * 10);
      x = Math.floor(Math.random() * 10);

      const hasBeenHit = opponent.gameboard.hitAttacks.some(
        (coord) => coord[0] === y && coord[1] === x
      );
      const hasBeenMissed = opponent.gameboard.missedAttacks.some(
        (coord) => coord[0] === y && coord[1] === x
      );

      if (!hasBeenHit && !hasBeenMissed) {
        moveIsValid = true;
      }
    }

    this.attack([y, x], opponent);
  }
}

export default Player;
