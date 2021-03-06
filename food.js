const { keys } = require("./keys");
const { search } = require("./search");
const { sortByClosest } = require("./helpers");
function eat({ grid, data, urgent }) {
  // TODO: Later decide if the closest option is the best option
  // Maybe the direction is close to large snake.
  let move;
  const sortedFood = sortByClosest(data.you.head, data.board.food);
  for (let i = 0; i < data.board.food.length; i++) {
    food = sortedFood[i];
    move = search(grid, data.you.head, food);
    if (move) return move;
  }
  if (!move) {
    return { direction: null };
  }
  const { direction, coordinates } = move;
  const score = rateMove(coordinates);
  return { direction, score };
}

module.exports = { eat };
function rateMove(score) {
  return 10; // todo
}
