const { move, avoidWalls } = require("./../move");
const mocks = require("../_mocks_/stayAlive.json");
const { createGrid } = require("../grid");

function simpleAvoidWalls() {
  const data = mocks.simpleAvoidWall;
  const grid = createGrid(data);

  console.log("walls are bad:", avoidWalls(grid, data).direction !== "left");
}
simpleAvoidWalls();

function avoidWalls_1() {
  const data = mocks.avoidWalls_1;
  const grid = createGrid(data);

  console.log(
    "up against a wall and one move left:",
    avoidWalls(grid, data).direction == "down"
  );
}
avoidWalls_1();
