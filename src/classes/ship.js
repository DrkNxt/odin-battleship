class Ship {
  /**
   * Create a new Ship with a length of `length`
   * @param {number} length
   */
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  /**
   * Make this ship take a hit
   */
  hit() {
    this.hits++;
    this.isSunk();
  }

  /**
   * Check if this ship has been sunk
   * @returns true if ship is sunk, otherwise false
   */
  isSunk() {
    if (this.hits >= this.length) {
      this.sunk = true;
    }
    return this.sunk;
  }
}

export { Ship };
