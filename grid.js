const { getNeighbors } = require("./helpers");
const { keys } = require("./keys");
function createGrid(data) {
  const WIDTH = data.board.width;
  const HEIGHT = data.board.height;

  const grid = [];
  for (let i = 0; i < HEIGHT; i++) {
    grid.push([]);
    for (let j = 0; j < WIDTH; j++) {
      grid[i][j] = 0;
    }
  }

  const {
    board: { food, snakes },
    you,
  } = data;

  // plot you
  plot(grid, you.body, "YOU", true);

  //plot food
  plot(grid, food, "FOOD");

  // plot snakes
  snakes
    .filter((s) => s.id !== you.id)
    .forEach((snake) => {
      plot(grid, snake.body, "ENEMY", true, snake.length >= you.length);
    });

  return grid;
}

function plot(grid, entity, type, isSnake = false, isDangerous = true) {
  let state = type;
  //plotting head first

  if (isSnake) {
    // const length = entity.length
    const head = entity.splice(0, 1);

    // we specify specifically if its a snake head
    // because we will treat them diff
    state = `${type}_HEAD`;
    //plot head
    grid[head[0].y][head[0].x] = keys[state];

    const tail = entity.splice(-1, 1);
    state = `${type}_TAIL`;
    grid[tail[0].y][tail[0].x] = keys[state];

    //add zones around enemy snake
    if (type == "ENEMY") {
      getNeighbors(grid, head).forEach((n) => {
        grid[n.y][n.x] = isDangerous ? keys[`WARNING_ZONE`] : keys[`KILL_ZONE`];
      });

      //try and predict next move
      const directNextHeadSpace = findSnakeProbableNextMove(
        grid,
        head[0],
        entity
      );
      state = `DANGER_ZONE`;
      grid[directNextHeadSpace.y][directNextHeadSpace.x] = keys[state];
    }

    state = `${type}_BODY`;
  }

  //loop through and plot
  entity.forEach((point) => {
    grid[point.y][point.x] = keys[state];
  });
}

module.exports = {
  createGrid,
  keys,
};

function findSnakeProbableNextMove(grid, head, body) {
  // getNeighbors
  const neighbors = getNeighbors(grid, head);
  // check if opposite of head exists
  const inFrontOfHead = getDir(head, body[0]); // we removed the head before call site so the next part is the body
  if (
    inFrontOfHead &&
    neighbors.some((n) => n.x == inFrontOfHead.x && n.y == inFrontOfHead.y)
  ) {
    return inFrontOfHead;
  } else {
    return neighbors[0];
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
