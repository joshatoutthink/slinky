const { move, avoidWalls } = require("./../move");
const mocks = require("../_mocks_/stayAlive.json");
const { createGrid } = require("../grid");
const { test } = require("./log");
function simpleAvoidWalls() {
  const data = mocks.simpleAvoidWall;
  const grid = createGrid(data);

  test("walls are bad:", avoidWalls(grid, data).direction !== "left");
}
simpleAvoidWalls();

function avoidWalls_1() {
  const data = mocks.avoidWalls_1;
  const grid = createGrid(data);

  test(
    "up against a wall and one move left:",
    avoidWalls(grid, data).direction == "down"
  );
}
avoidWalls_1();

function dontCoilToTightly() {
  const data = mocks.dontCoilToTightly;
  const grid = createGrid(data);

  test(
    "doesnt coil to tight:",
    avoidWalls(grid, data).direction == "up",
    move({ body: data }) == "up"
  );
}
dontCoilToTightly();
