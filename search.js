const { sortByClosest } = require("./helpers");
module.exports.search = function search(grid, data, targetData, targetKey) {
  let shortestPath = 9999;
  const {
    you: { head },
    board,
    game,
  } = data;
  const aStarGrid = createAStarGrid(grid);
  let current = head; // todo this needs to be more dynamic
  let closestTarget = sortByClosest(head, targetData)[0]; // this may need to change if no good path is found

  const openSet = [current];
  const closedSet = [];

  while (openSet.length) {}
}; //returns array of {dir, score} sorted by greatest to least.

function createAStarGrid(grid) {
  const g = new Array(grid.length);
  for (let i = 0; i < g.length; i++) {
    g.push([]);
    for (let j = 0; j < grid[i].length; j++) {
      const x = j;
      const y = i;
      const state = grid[i][j];
      g[i][j] = new Cell(x, y);
    }
  }
}

class Tree {
  constructor(root, grid) {
    this.root = root;
    this.grid = grid;
    this.cells = [];
    this.createCells(grid);
  }

  createCells(grid) {
    console.log(grid);
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const x = j;
        const y = i;
        const state = grid[i][j];
        const neighbors = [];
        const left = grid[y]?.[x - 1];
        const up = grid[y + 1]?.[x];
        const right = grid[y]?.[x + 1];
        const down = grid[y - 1]?.[x];
        if (typeof left !== "undefined") {
          neighbors.push({
            x: x - 1,
            y: y,
            state: grid[y][x - 1],
          });
        }
        if (typeof up !== "undefined") {
          neighbors.push({
            x: x,
            y: y + 1,
            state: grid[y + 1][x],
          });
        }
        if (typeof right !== "undefined") {
          neighbors.push({
            x: x + 1,
            y: y,
            state: grid[y][x + 1],
          });
        }
        if (typeof down !== "undefined") {
          neighbors.push({
            x: x,
            y: y - 1,
            state: grid[y - 1][x],
          });
        }
        this.cells.push(new Cell(x, y, state, neighbors));
      }
    }
  }

  search(target) {
    //todo
  }
}
class Cell {
  constructor(x, y, state, neighbors) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.neighbors = neighbors;
  }
}

console.log(
  JSON.stringify(
    new Tree({ x: 0, y: 0 }, [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]).cells,
    null,
    2
  )
);
