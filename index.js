var express = require("express");

var app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", remmy);
app.post("/start", start);
app.post("/move", move);
app.post("/end", end);
app.listen(PORT);
console.log(`go to http://localhost:${PORT}`);

function remmy(req, res) {
  res.status(200).json({
    apiversion: "1",
    author: "joshatoutthink",
    color: "#399AF2",
    head: "evil",
    tail: "bolt",
    version: "0.0.1-beta",
  });
}

const allMoves = ["left", "up", "right", "down"];
function move(req, res) {
  let moves = [...allMoves];
  const { game, turn, board, you } = req.body;

  // ONE MOVE AHEAD
  moves = avoidWalls(moves, board.height, you.head); // Avoiding Walls

  moves = avoidSnake(moves, you.body, you.head); // Avoiding ME
  // Avoid other snakes
  const mySnakeId = you.id;
  board.snakes.forEach((snake) => {
    moves = avoidSnake(moves, snake.body, you.head); // Avoiding ME
    moves = avoidSnakeNextMove(moves, snake.body, you);
  });

  console.log(moves);
  if (you.health <= 50) {
    moves = toFood(moves, board.food, you.head);
  } else {
    // MOVE TOWARDS TAIL
    moves = toTail(moves, you.body[you.body.length - 1], you.head);
  }
  direction = moves[Math.floor(Math.random() * moves.length)];
  console.log(direction);
  res.status(200).json({
    move: direction,
  });
}

function start(_, res) {
  console.log("GAME STARTING");
  res.status(200).send("ok");
}
function end() {
  console.log("GAME ENDED \n \n");
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

function avoidSnakeNextMove(moves, parts, me) {
  const snakeHead = parts[0];
  const myHead = me.head;
  const snakeLength = parts.length;
  const myLength = me.body.length;

  if (myLength > snakeLength) return moves; // noop. if Im bigger than move is still safe

  const MyAvailable = getMoves(moves, myHead);
  return Object.keys(MyAvailable).filter((move) => {
    const { x: myX, y: myY } = MyAvailable[move];
    return !Object.keys(getMoves(allMoves, snakeHead)).some(
      (oSMove) => oSMove.x == myX && oSMove.y == myY
    );
  });
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
  console.log(move);
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
