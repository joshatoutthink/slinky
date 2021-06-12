const { keys } = require("./grid");
const { search } = require("./search");
function eat({ grid, data, urgent }) {
  // TODO: Later decide if the closest option is the best option
  // Maybe the direction is close to large snake.
  return search(grid, data, data.board.food, keys.FOOD)[0];
}

module.exports = { eat };
