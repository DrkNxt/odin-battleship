import { Gameboard } from "../classes/gameboard.js";
import { Ship } from "../classes/ship.js";

let gameboard;
beforeEach(() => {
  gameboard = new Gameboard();
});

describe("Class Gameboard:", () => {
  describe("addShip():", () => {
    test("horizontal", () => {
      gameboard.addShip(2, [1, 3]);
      expect(gameboard.ships[0].ship).toBeInstanceOf(Ship);
      expect(gameboard.ships[0].ship.length).toBe(2);
      expect(gameboard.ships[0].coordinates).toEqual([
        [1, 3],
        [2, 3],
      ]);
      expect(gameboard.ships[0].horizontal).toBe(true);
    });

    test("vertical", () => {
      gameboard.addShip(3, [4, 6], false);
      expect(gameboard.ships[0].ship).toBeInstanceOf(Ship);
      expect(gameboard.ships[0].ship.length).toBe(3);
      expect(gameboard.ships[0].coordinates).toEqual([
        [4, 6],
        [4, 7],
        [4, 8],
      ]);
      expect(gameboard.ships[0].horizontal).toBe(false);
    });

    test("outside board (too high)", () => {
      expect(() => gameboard.addShip(3, [11, 6], false)).toThrow(
        "Gameboard.addShip(): Cannot create ship outside of board"
      );
    });

    test("outside board (too low)", () => {
      expect(() => gameboard.addShip(1, [-1, 6], false)).toThrow(
        "Gameboard.addShip(): Cannot create ship outside of board"
      );
    });

    test("too long to fit (horizontal)", () => {
      gameboard.addShip(3, [8, 6]);
      expect(gameboard.ships[0].ship).toBeInstanceOf(Ship);
      expect(gameboard.ships[0].ship.length).toBe(3);
      expect(gameboard.ships[0].coordinates).toEqual([
        [7, 6],
        [8, 6],
        [9, 6],
      ]);
      expect(gameboard.ships[0].horizontal).toBe(true);
    });

    test("too long to fit (vertical)", () => {
      gameboard.addShip(2, [8, 9], false);
      expect(gameboard.ships[0].ship).toBeInstanceOf(Ship);
      expect(gameboard.ships[0].ship.length).toBe(2);
      expect(gameboard.ships[0].coordinates).toEqual([
        [8, 8],
        [8, 9],
      ]);
      expect(gameboard.ships[0].horizontal).toBe(false);
    });

    test("multiple ships", () => {
      gameboard.addShip(2, [8, 9], false);
      gameboard.addShip(2, [1, 3]);
      expect(gameboard.ships[0].ship).toBeInstanceOf(Ship);
      expect(gameboard.ships[0].ship.length).toBe(2);
      expect(gameboard.ships[0].coordinates).toEqual([
        [8, 8],
        [8, 9],
      ]);
      expect(gameboard.ships[0].horizontal).toBe(false);

      expect(gameboard.ships[1].ship).toBeInstanceOf(Ship);
      expect(gameboard.ships[1].ship.length).toBe(2);
      expect(gameboard.ships[1].coordinates).toEqual([
        [1, 3],
        [2, 3],
      ]);
      expect(gameboard.ships[1].horizontal).toBe(true);
    });

    test("overlapping ships", () => {
      gameboard.addShip(2, [8, 9], false);
      expect(gameboard.ships[0].ship).toBeInstanceOf(Ship);
      expect(gameboard.ships[0].ship.length).toBe(2);
      expect(gameboard.ships[0].coordinates).toEqual([
        [8, 8],
        [8, 9],
      ]);
      expect(gameboard.ships[0].horizontal).toBe(false);
      expect(() => gameboard.addShip(2, [7, 8])).toThrow(
        "Gameboard.addShip(): Cannot create ship; Right position is already taken"
      );
      expect(gameboard.ships).toHaveLength(1);
      expect(gameboard.boardMatrix[7][8].hasShip).toBe(false);
      expect(gameboard.boardMatrix[8][8].hasShip).toBe(true);
      expect(gameboard.boardMatrix[8][9].hasShip).toBe(true);
    });
  });

  describe("receiveAttack():", () => {
    test("missed Attack", () => {
      expect(gameboard.boardMatrix[0][0].isAttacked).toBe(false);
      gameboard.receiveAttack([0, 0]);
      expect(gameboard.boardMatrix[0][0].isAttacked).toBe(true);
    });

    test("missed multiple Attacks", () => {
      expect(gameboard.boardMatrix[2][4].isAttacked).toBe(false);
      gameboard.receiveAttack([2, 4]);
      expect(gameboard.boardMatrix[4][2].isAttacked).toBe(false);
      gameboard.receiveAttack([4, 2]);
      expect(gameboard.boardMatrix[6][1].isAttacked).toBe(false);
      gameboard.receiveAttack([6, 1]);
      expect(gameboard.boardMatrix[2][4].isAttacked).toBe(true);
      expect(gameboard.boardMatrix[4][2].isAttacked).toBe(true);
      expect(gameboard.boardMatrix[6][1].isAttacked).toBe(true);
    });

    test("attack same position twice", () => {
      expect(gameboard.boardMatrix[0][0].isAttacked).toBe(false);
      expect(gameboard.receiveAttack([0, 0])).toBe(true);
      expect(gameboard.boardMatrix[0][0].isAttacked).toBe(true);
      expect(gameboard.receiveAttack([0, 0])).toBe(false);
    });

    test("hit ship", () => {
      gameboard.addShip(2, [0, 0]);
      expect(gameboard.boardMatrix[0][0].isAttacked).toBe(false);
      expect(gameboard.boardMatrix[0][0].hasShip).toBe(true);
      expect(gameboard.ships[0].ship.hits).toBe(0);
      gameboard.receiveAttack([0, 0]);
      expect(gameboard.boardMatrix[0][0].isAttacked).toBe(true);
      expect(gameboard.boardMatrix[0][0].hasShip).toBe(true);
      expect(gameboard.ships[0].ship.hits).toBe(1);
    });
  });

  describe("allShipsSunk():", () => {
    test("not all ships sunk", () => {
      gameboard.addShip(2, [0, 0]);
      expect(gameboard.allShipsSunk()).toBe(false);
    });

    test("all ships sunk", () => {
      gameboard.addShip(2, [0, 0]);
      gameboard.receiveAttack([0, 0]);
      gameboard.receiveAttack([1, 0]);
      expect(gameboard.allShipsSunk()).toBe(true);
    });
  });
});
