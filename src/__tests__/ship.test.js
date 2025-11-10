import { Ship } from "../classes/ship.js";

let ship;
beforeEach(() => {
  ship = new Ship(2);
});

describe("Class Ship:", () => {
  test("takes hits", () => {
    ship.hit();
    expect(ship.hits).toBe(1);
    expect(ship.sunk).toBeFalsy();
  });

  test("sinks when hit ship.length times", () => {
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(2);
    expect(ship.sunk).toBeTruthy();
  });
});
