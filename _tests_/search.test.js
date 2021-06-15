const { search } = require("./../search");
const mocks = require("../_mocks_/searchForFood.json");
const { createGrid } = require("../grid");

function nextToFood() {
  const data = mocks.nextToFood;
  const grid = createGrid(data);

  console.log(
    "can eat food thats next to it:",
    search(grid, data, data.board.food[0], true).direction == "left"
  );
}
nextToFood();

function noPathToFood() {
  const data = mocks.noPathToFood;
  const grid = createGrid(data);

  console.log(
    "wont try and get food if no path:",
    search(grid, data, data.board.food[0], true) == null
  );
}
noPathToFood();
