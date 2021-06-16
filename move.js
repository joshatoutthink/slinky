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

  let direction;

  // GET BIG AND STRONG
  if (turn < 75 || you.health < 20) {
    const moved = eat({ grid, data: req.body, urgent: true });
    if (moved && moved.direction) {
      console.log("Getting some Food food");
      direction = moved.direction;
    }
  }

  // CHECK FOR SMALL SNAKES
  // TODO

  //PROTECT SELF BY CHASING TAIL
  if (!direction) {
    direction = toTail(grid, req.body);
    if (direction) {
      console.log("moving towards tail");
    } else {
      console.log("no path to tail");
    }
  }

  // CANT FIND TAIL JUST STAY ALIVE
  if (!direction) {
    const move = avoidWalls(grid, req.body);
    direction = move && move.direction;

    if (direction) {
      console.log("Just trying to stay alive");
    } else {
      console.log("you lost");
      return "down";
    }
  }

  console.log(direction); // ->
  return direction;
}

module.exports = { move, avoidWalls };

function toTail(grid, data) {
  const tail = data.you.body[data.you.body.length - 1];
  const beforeTail = data.you.body[data.you.body.length - 2];
  const afterTail = getDir(tail, beforeTail);
  console.log({ beforeTail, tail, afterTail });
  if (
    afterTail.x > grid.length ||
    afterTail.y > grid.length ||
    afterTail.x < 0 ||
    afterTail.y < 0
  ) {
    const move = search(grid, data.you.head, tail);
    if (move && move.direction) {
      return move.direction;
    }
  } else {
    const move = search(grid, data.you.head, afterTail);
    if (move && move.direction) {
      return move.direction;
    }
  }
}

function avoidWalls(grid, data) {
  const head = data.you.head;
  const viableMoves = getNeighbors(grid, head);
  for (let i = 0; i < viableMoves.length; i++) {
    let direction;
    // TODO:
    // refactor this to just check for most available space
    if ((direction = search(grid, data.you.head, viableMoves[i]))) {
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
