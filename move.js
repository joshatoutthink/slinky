const { createGrid } = require("./grid");
const { getNeighbors } = require("./helpers");
const { keys } = require("./keys");

const {
  smallSnakesNear,
  avoidLargeSnakes,
  largeSnakeAround,
  hunt,
} = require("./otherSnakes");
const { eat } = require("./food");
const { moveAroundPerimeter } = require("./areaControl");
const { search } = require("./search");

function move(req) {
  const { game, turn, board, you } = req.body;
  const grid = createGrid(req.body);

  // const availableMoves = {};

  // let MovedToEat = false;
  // console.log(grid);
  // // check if need food
  // if (you.health < 30) {
  //   MovedToEat = true;
  //   const moveToEat = eat({ grid, data: req.body, urgent: true }); // ea. {direction:UP, score: 1}
  //   availableMoves[moveToEat.direction] = moveToEat.score;
  //   console.log(availableMoves);
  // }

  // // check if any snakes can be eaten close by
  // if (smallSnakesNear(grid, req.body)) {
  //   const moveToHunt = hunt(grid, req.body); // ea. {direction:UP, score: 1}
  //   if (!availableMoves[moveToHunt.direction]) {
  //     availableMoves[moveToHunt.direction] = 0;
  //   }
  //   availableMoves[moveToHunt.direction] += moveToHunt.score;
  // }

  // // check if should be bulking up
  // if (you.length < 6 && !MovedToEat) {
  //   const moveToEat = eat({ grid, data: req.body, urgent: true }); // ea. {direction:UP, score: 1}
  //   if (!availableMoves[moveToEat.direction]) {
  //     availableMoves[moveToEat.direction] = 0;
  //   }
  //   availableMoves[moveToEat.direction] += moveToEat.score;
  // }

  // //todo // check if easy to eat / trap snake

  // // check for large snakes in area
  // if (largeSnakeAround(grid, req.body)) {
  //   const moveToAvoid = avoidLargeSnakes(grid, req.body);
  //   if (!availableMoves[moveToAvoid.direction]) {
  //     availableMoves[moveToAvoid.direction] = 0;
  //   }
  //   availableMoves[moveToAvoid.direction] += moveToEat.score;
  // }

  // // circle arena 2 in
  // {
  //   const moveToPerimeter = moveAroundPerimeter(grid, req.body, 2);
  //   if (!availableMoves[moveToPerimeter.direction]) {
  //     availableMoves[moveToPerimeter.direction] = 0;
  //   }
  //   availableMoves[moveToPerimeter.direction] += moveToPerimeter.score;
  // }
  // console.log(availableMoves);
  // const direction = Object.keys(availableMoves).sort(
  //   (a, b) => availableMoves[a] - availableMoves[b]
  // )[0]; // returns highest scored direction
  let direction;

  if (turn < 75 || you.health < 20) {
    const moved = eat({ grid, data: req.body, urgent: true });
    if (moved && moved.direction) {
      console.log("food");
      direction = moved.direction;
    }
  }
  if (!direction) {
    console.log("to tail");
    direction = toTail(grid, req.body);
  }
  if (!direction) {
    console.log("walls");
    direction = avoidWalls(grid, req.body).direction;
  }

  console.log(direction);
  return direction;
}

module.exports = { move };

function toTail(grid, data) {
  const tail = data.you.body[data.you.body.length - 1];
  const beforeTail = data.you.body[data.you.body.length - 2];
  const afterTail = getDir(tail, beforeTail);
  return search(grid, data, afterTail, true)?.direction || null;
}

function avoidWalls(grid, data) {
  const head = data.you.head;
  const viableMoves = getNeighbors(grid, head);
  for (let i = 0; i < viableMoves.length; i++) {
    if ((direction = search(grid, data, viableMoves[i], true))) {
      return direction;
    }
  }
}

function getDir(a, b) {
  if (a.x > b.x) {
    return { x: a.x + 1, y: a.y };
  }
  if (a.x < b.x) {
    return { x: a.x - 1, y: a.y };
  }
  if (a.y > b.y) {
    return { x: a.x, y: a.y + 1 };
  }
  if (a.y < b.y) {
    return { x: a.x, y: a.y - 1 };
  }
}
