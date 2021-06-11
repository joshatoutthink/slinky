const EMPTY = 0;
const YOU_HEAD = 1;
const YOU_BODY = 2;
const ENEMY_BODY = 3;
const ENEMY_HEAD = 4;
const FOOD = 5;

const keys = {
  EMPTY,
  YOU_HEAD,
  YOU_BODY,
  ENEMY_HEAD,
  ENEMY_BODY,
  FOOD,
};

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
  // plot snakes
  snakes.forEach((snake) => {
    plot(grid, snake.body, "ENEMY", true);
  });

  // plot you
  plot(grid, you.body, "YOU", true);

  //plot food
  plot(grid, food, "FOOD");

  console.log(grid.map((y) => JSON.stringify(y)));
}

function plot(grid, entity, type, isSnake) {
  let state = type;
  //plotting head first

  if (isSnake) {
    const head = entity.splice(0, 1);

    // we specify specifically if its a snake head
    // because we will treat them diff
    state = `${type}_HEAD`;
    //plot head
    grid[head[0].y][head[0].x] = keys[state];

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

createGrid(require("./testMove.json").body);