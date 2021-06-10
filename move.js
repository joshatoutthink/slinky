const allMoves = ["left", "up", "right", "down"];

function move(req) {
  let moves = [...allMoves];
  const { game, turn, board, you } = req.body;

  // ONE MOVE AHEAD
  moves = avoidWalls(moves, board.height, you.head); // Avoiding Walls

  moves = avoidSnake(moves, you.body, you.head); // Avoiding ME
  // Avoid other snakes

  const mySnakeId = you.id;
  board.snakes
    .filter((snake) => snake.id !== mySnakeId)

    .forEach((snake) => {
      moves = avoidSnake(moves, snake.body, you.head);
      moves = avoidSnakeNextMove(moves, snake, you);
    });

  if (you.health <= 50) {
    moves = toFood(moves, board.food, you.head);
  } else {
    // MOVE TOWARDS TAIL
    moves = toTail(moves, you.body[you.body.length - 1], you.head);
  }

  direction = moves[Math.floor(Math.random() * moves.length)];
  console.log(moves);
  console.log(direction);
  return direction;
}

//STRATEGY

function avoidWalls(moves, gameSize, myHead) {
  const available = getMoves(moves, myHead); //{move:[x,y]}
  return Object.keys(available).filter((move) => {
    const { x, y } = available[move];
    return x <= gameSize - 1 && x >= 0 && y <= gameSize - 1 && y >= 0;
  });
}

function avoidSnake(moves, parts, myHead) {
  const available = getMoves(moves, myHead); //{move:[x,y]}
  return Object.keys(available).filter((move) => {
    const { x, y } = available[move];
    if (parts.some((part) => part.x == x && part.y == y)) {
      return false;
    }
    return true;
  });
}

function avoidSnakeNextMove(moves, snake, me) {
  const snakeHead = snake.head;
  const myHead = me.head;
  const snakeLength = snake.length;
  const myLength = me.length;

  if (myLength > snakeLength) return moves; // noop. if Im bigger than move is still safe

  const MyAvailable = getMoves(moves, myHead);
  const enemyMovesAvailable = getMoves(allMoves, snakeHead);

  const myMovesLeft = Object.keys(MyAvailable).filter((myMove) => {
    const { x: myX, y: myY } = MyAvailable[myMove];
    const enemyMoveDirections = Object.keys(enemyMovesAvailable);

    const sameDirection = enemyMoveDirections.find((enemyDir) => {
      const { x: snakeX, y: snakeY } = enemyMovesAvailable[enemyDir];
      return snakeX == myX && snakeY == myY;
    });

    if (sameDirection) {
      return false;
    } else {
      return true;
    }
  }); //filtering myMoves

  return myMovesLeft;
}

function toTail(moves, myTail, myHead) {
  const available = getMoves(moves, myHead); //{move:[x,y]}
  if (!available || !Object.keys(available).length) return [];
  return [
    Object.keys(available).reduce((current, { x, y }) => {
      const currentYDistance = getDistanceBetween(myTail.y, current.y);
      const currentXDistance = getDistanceBetween(myTail.x, current.x);

      const yDistance = getDistanceBetween(myTail.y, y);
      const xDistance = getDistanceBetween(myTail.x, x);
      const totalCurrent = currentYDistance + currentXDistance;
      const totalMove = xDistance + yDistance;

      if (totalCurrent - totalMove > 0) {
        return { x, y };
      }
      return current;
    }),
  ];
}

function toFood(moves, food, head) {
  const available = getMoves(moves, head); //{move:[x,y]}
  const closestFood = sortByClosest(head, food)[0];
  const moveCoordsToFood = sortByClosest(
    closestFood,
    Object.values(available)
  )[0];
  const move = Object.keys(available).find(
    (move) =>
      available[move].x == moveCoordsToFood.x &&
      available[move].y == moveCoordsToFood.y
  );
  return [move];
}

//HELPERS

function getMoves(moves, coord) {
  return moves.reduce((coords, move) => {
    coords[move] = GO[move.toUpperCase()](coord);
    return coords;
  }, {});
}

const GO = {
  LEFT: function LEFT({ x, y }) {
    return { x: x - 1, y };
  },
  UP: function UP({ x, y }) {
    return { x, y: y + 1 };
  },
  RIGHT: function RIGHT({ x, y }) {
    return { x: x + 1, y };
  },
  DOWN: function DOWN({ x, y }) {
    return { x, y: y - 1 };
  },
};

function getDistanceBetween(a, b) {
  return Math.abs(a - b);
}

function sortByClosest(goTo, coord) {
  return coord.sort((a, b) => {
    const aYDistance = getDistanceBetween(goTo.y, a.y);
    const aXDistance = getDistanceBetween(goTo.x, a.x);

    const bYDistance = getDistanceBetween(goTo.y, b.y);
    const bXDistance = getDistanceBetween(goTo.x, b.x);
    const aTotal = aYDistance + aXDistance;
    const bTotal = bXDistance + bYDistance;

    return aTotal - bTotal;
  });
}
module.exports = { move };
