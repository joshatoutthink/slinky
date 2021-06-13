const { keys } = require("./grid");
const { search } = require("./search");
function eat({ grid, data, urgent }) {
  // TODO: Later decide if the closest option is the best option
  // Maybe the direction is close to large snake.
  const { direction, coordinates } = search(grid, data, data.board.food);
  const score = rateMove(coordinates);
  return { direction, score };
}

module.exports = { eat };
function rateMove(score) {
  return 10; // todo
}
