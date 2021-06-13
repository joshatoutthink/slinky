const { sortByClosest, getDistanceBetween } = require("./helpers");
const { keys } = require("./grid");
module.exports.search = function search(grid, data, targetData, targetKey) {
  let shortestPath = 9999;
  const {
    you: { head },
    board,
    game,
  } = data;
  const cellTree = new Tree(head, grid);
  let closestTarget = sortByClosest(head, targetData)[0]; // this may need to change if no good path is found

  return cellTree.getPathsTo(closestTarget);
}; //returns array of {dir, score} sorted by greatest to least.

class Tree {
  constructor(root, grid) {
    this.root = root;
    this.grid = grid;
    this.cells = [];
    this.createCells(grid);
  }

  createCells(grid) {
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

  getRootCell() {
    return this.cells.find(({ x, y }) => {
      return this.root.x == x && this.root.y == y;
    });
  }

  getCell(sX, sY) {
    return this.cells.find(({ x, y }) => {
      return sX == x && sY == y;
    });
  }

  getPathsTo(target) {
    const start = this.getRootCell();
    let current = start;

    const cellsToCheck = [current];
    const checkedCells = [];

    while (cellsToCheck.length) {
      //set baseline
      let lowestF = 999;
      let lowestCell = { x: 99, y: 99 };

      // check which has the lowest f score.
      cellsToCheck.forEach(({ x, y }) => {
        //this might be done with a reduce
        const cell = this.getCell(x, y);
        if (cell.f < lowestF) {
          lowestF = cell.f;
          lowestCell = { x, y };
        }
      });

      // if found target
      if (sameCell(target, lowestCell)) {
        const coordinates = this.retracePathToRoot(lowestCell); //TODO
        return calcDirection(start, coordinates);
      }

      // continue the search
      current = lowestCell;
      let currentCell = this.getCell(current);

      // remove current from cells to check && add to checkedCells
      checkedCells.push(current);
      cellsToCheck = cellsToCheck.filter((cell) => sameCell(cell, current));

      //using and old fashion for loop so we can break early
      for (let i = 0; i < currentCell.neighbors.length; i++) {
        const neighbor = currentCell.neighbors[i];
        const neighborCell = this.getCell(neighbor);

        // check if found target
        if (sameCell(target, neighbor)) {
          const coordinates = this.retracePathToRoot(neighborCell); //TODO
          return calcDirection(start, coordinates);
        }

        // if neighborCell is a valid space to move to && and we haven't already checked it (its in checked cells)
        if (
          neighborCell.state < keys.ENEMY_BODY &&
          !inArray(checkedCells, neighbor)
        ) {
          // update distance traveled
          const tempG = currentCell.g + 1;
          let shortest = true;

          if (inArray(cellsToCheck, neighbor)) {
            if (tempG > neighborCell.g) {
              shortest = false;
            }
          } else {
            cellsToCheck.push(neighbor);
          }
          // update the cells score
          if (shortest) {
            neighborCell.updateScore(
              tempG,
              getDistanceBetween(neighbor, target)
            );
            neighborCell.setPrevious(current);
          }
        }
      }
    }
  }

  retracePathToRoot(cell) {
    if (sameCell(this.root, cell.previous)) {
      return cell;
    }
    return this.retracePathToRoot(cell.previous);
  }
}

class Cell {
  constructor(x, y, state, neighbors) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.neighbors = neighbors;
    this.g = 0; // distance from start
    this.h = 0;
    this.f = 0;
    this.previous = null;
  }
  updateScore(tempG, distanceToTarget) {
    this.g = tempG;
    this.h = distanceToTarget;
    this.f = this.g + this.h;
  }
  setPrevious(coordinates) {
    this.previous = coordinates; // {x,y}
  }
}

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

function calcDirection(from, to) {
  const x = to.x - from.x;
  const y = to.y - from.y;

  if (x == -1 && y == 0) {
    return "left";
  }
  if (x == 1 && y == 0) {
    return "right";
  }
  if (x == 0 && y == 1) {
    return "up";
  }
  if (x == 0 && y == -1) {
    return "down";
  }
}

console.log();
