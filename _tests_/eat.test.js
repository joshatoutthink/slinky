const { eat } = require("./../food");

const mocks = require("../_mocks_/searchForFood.json");
const mocksStayAlive = require("../_mocks_/stayAlive.json");
const { createGrid } = require("../grid");

function chooseClosestFood() {
  const data = mocks.chooseClosestFood;
  const grid = createGrid(data);

  console.log(
    "Chooses the Closest Food:",
    eat({ grid, data }).direction == "left"
  );
}
// chooseClosestFood();

function chooseShortestFoodPath() {
  //TODO
  const data = mocks.chooseShortestFoodPath;
  const grid = createGrid(data);

  console.log(
    "TODO:",
    "Chooses the Closest Food:",
    eat({ grid, data }).direction == "right"
  );
}
chooseShortestFoodPath();

function noPathToFood() {
  const data = mocks.noPathToFood;
  const grid = createGrid(data);

  console.log(
    "wont try and get food if no path:",
    eat({ grid, data }).direction == null
  );
}
noPathToFood();

function avoidSelfAndStillGetFood() {
  const data = mocksStayAlive.avoidSelfAndStillGetFood;
  const grid = createGrid(data);

  console.log(
    "can avoid self and still get food:",
    eat({ grid, data }).direction == "right"
  );
}

avoidSelfAndStillGetFood();
