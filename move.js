const { createGrid, keys } = require("./grid");
const {
  smallSnakesNear,
  avoidLargeSnakes,
  largeSnakeAround,
  hunt,
} = require("./otherSnakes");
const { eat } = require("./food");
const { moveAroundPerimeter } = require("./areaControl");

function move(req) {
  const { game, turn, board, you } = req.body;
  const grid = createGrid(req.body);

  const availableMoves = {};

  let MovedToEat = false;
  console.log(grid);
  // check if need food
  if (you.health < 30) {
    MovedToEat = true;
    const moveToEat = eat({ grid, data: req.body, urgent: true }); // ea. {direction:UP, score: 1}
    availableMoves[moveToEat.direction] = moveToEat.score;
    console.log(availableMoves);
  }

  // check if any snakes can be eaten close by
  if (smallSnakesNear(grid, req.body)) {
    const moveToHunt = hunt(grid, req.body); // ea. {direction:UP, score: 1}
    if (!availableMoves[moveToHunt.direction]) {
      availableMoves[moveToHunt.direction] = 0;
    }
    availableMoves[moveToHunt.direction] += moveToHunt.score;
  }

  // check if should be bulking up
  if (you.length < 6 && !MovedToEat) {
    const moveToEat = eat({ grid, data: req.body, urgent: true }); // ea. {direction:UP, score: 1}
    if (!availableMoves[moveToEat.direction]) {
      availableMoves[moveToEat.direction] = 0;
    }
    availableMoves[moveToEat.direction] += moveToEat.score;
  }

  //todo // check if easy to eat / trap snake

  // check for large snakes in area
  if (largeSnakeAround(grid, req.body)) {
    const moveToAvoid = avoidLargeSnakes(grid, req.body);
    if (!availableMoves[moveToAvoid.direction]) {
      availableMoves[moveToAvoid.direction] = 0;
    }
    availableMoves[moveToAvoid.direction] += moveToEat.score;
  }

  // circle arena 2 in
  {
    const moveToPerimeter = moveAroundPerimeter(grid, req.body, 2);
    if (!availableMoves[moveToPerimeter.direction]) {
      availableMoves[moveToPerimeter.direction] = 0;
    }
    availableMoves[moveToPerimeter.direction] += moveToPerimeter.score;
  }
  console.log(availableMoves);
  const direction = Object.keys(availableMoves).sort(
    (a, b) => availableMoves[a] - availableMoves[b]
  )[0]; // returns highest scored direction

  return direction;
}

module.exports = { move };
