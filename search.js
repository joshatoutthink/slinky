const { sortByClosest, getNeighbors } = require("./helpers");
const { keys } = require("./keys");

const search = function search(grid, from, to) {
  console.log("target", to);
  console.log("head", from);
  const coordinates = aStarSearch(grid, from, to);
  if (coordinates == -1) {
    return null;
  }
  console.log("coordinates", coordinates);

  let direction = calcDir(from, coordinates);

  if (!direction) {
    direction = calcDir(from, to);
  }
  console.log(direction);
  return { direction, coordinates };
}; //returns array of {dir, score} sorted by greatest to least.

function calcDir({ x: sx, y: sy }, { x, y }) {
  if (sx == x && sy + 1 == y) {
    return "up";
  }
  if (sx == x && sy - 1 == y) {
    return "down";
  }
  if (sx - 1 == x && sy == y) {
    return "left";
  }
  if (sx + 1 == x && sy == y) {
    return "right";
  }
  console.log("no dir", { x: sx, y: sy }, { x, y });
}

function aStarSearch(maze, start, end) {
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

    if (lowestCell.x == end.x && lowestCell.y == end.y) {
      console.log("HEHEHEHEHEHEHEEHe");
      return end;
    }

    openSet = openSet.filter(({ x, y }) => {
      return x != lowestCell.x || y !== lowestCell.y;
    });

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
  console.log("steps", { x, y });
  const prev = v[y][x].previous;
  if (t.x == x && t.y == y) {
    return { x, y };
  }
  if (!prev) {
    return t;
  }
  if (t.x == prev.x && t.y == prev.y) {
    // console.log("finished", x, y);
    return { x, y };
  } else {
    return steps(v, t, prev);
  }
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

module.exports.search = search;
function validMove(maze, x, y) {
  return x < maze.length - 1 && x >= 0 && y < maze.length - 1 && y >= 0;
}

module.exports.calcDir = calcDir;
