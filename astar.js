const { keys } = require("./grid.js");

function search(maze, start, end) {
  const scores = getScores(maze);

  let openSet = [start];
  const closedSet = [];
  while (openSet.length) {
    const { lowestCell } = openSet.reduce(
      ({ lowest, lowestCell }, point) => {
        const pointScore = scores[point.y][point.x].f;
        if (pointScore < lowest) {
          return { lowest: pointScore, lowestCell: point };
        }
        return { lowest, lowestCell };
      },
      { lowestCell: { x: 99, y: 99 }, lowest: 99 }
    );

    openSet = [];
    closedSet.push(lowestCell);
    const current = lowestCell;

    const cellNeighbors = getNeighbors(maze, current);

    for (let i = 0; i < cellNeighbors.length; i++) {
      const n = cellNeighbors[i];

      if (n.x == end.x && n.y == end.y) {
        return steps(scores, start, current);
      }
      if (!closedSet.some((p) => n.x == p.x && p.y == n.y)) {
        openSet.push(n);
        const cScore = scores[current.y][current.x];
        scores[n.y][n.x].g = cScore.g + 1;
        scores[n.y][n.x].h = Math.abs(end.x - n.x) + Math.abs(end.y - n.y);
        scores[n.y][n.x].f = scores[n.y][n.x].h + scores[n.y][n.x].g;
        scores[n.y][n.x].previous = current;
      }
    }
  }
  return -1;
}

function steps(v, t, { x, y }) {
  const prev = v[y][x].previous;
  if (t.x == prev.x && t.y == prev.y) {
    console.log("finished", x, y);
    return { x, y };
  } else {
    return steps(v, t, prev);
  }
}

function getNeighbors(maze, { x, y }) {
  const neighbors = [];

  if (
    maze[y] &&
    typeof maze[y][x - 1] == "number" &&
    maze[y][x - 1] < keys.ENEMY_BODY
  ) {
    //left
    neighbors.push({ x: x - 1, y });
  }
  if (
    maze[y - 1] &&
    typeof maze[y - 1][x] == "number" &&
    maze[y - 1][x] < keys.ENEMY_BODY
  ) {
    //up

    neighbors.push({ x, y: y - 1 });
  }
  if (
    maze[y] &&
    typeof maze[y][x + 1] == "number" &&
    maze[y][x + 1] < keys.ENEMY_BODY
  ) {
    //right
    neighbors.push({ x: x + 1, y });
  }

  if (
    maze[y + 1] &&
    typeof maze[y + 1][x] == "number" &&
    maze[y + 1][x] < keys.ENEMY_BODY
  ) {
    //down
    neighbors.push({ x, y: y + 1 });
  }
  return neighbors;
}

function getScores(maze) {
  return maze.map((rows, y) =>
    rows.map((_, x) => ({
      x,
      y,
      state: maze[y][x],
      h: 0,
      g: 0,
      f: 0,
    }))
  );
}
console.log(
  search(
    [
      [2, 0, 0, 0, 0],
      [10, 0, 0, 0, 0],
      [10, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [10, 0, 0, 0, 0],
    ],
    { x: 0, y: 4 },
    { x: 0, y: 0 }
  )
);
