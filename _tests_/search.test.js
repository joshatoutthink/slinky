const { search } = require("./../search");
const mocks = require("../_mocks_/searchForFood.json");
const { createGrid } = require("../grid");
const { test } = require("./log");

function nextToFood() {
  const data = mocks.nextToFood;
  const grid = createGrid(data);

  test(
    "can eat food thats next to it:",
    search(grid, data.you.head, data.board.food[0]).direction == "left"
  );
}
nextToFood();

function noPathToFood() {
  const data = mocks.noPathToFood;
  const grid = createGrid(data);

  test(
    "wont try and get food if no path:",
    search(grid, data.you.head, data.board.food[0]) == null
  );
}
noPathToFood();
