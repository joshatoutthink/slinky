//HELPERS
module.exports.getMoves = function getMoves(moves, coord) {
  return moves.reduce((coords, move) => {
    coords[move] = GO[move.toUpperCase()](coord);
    return coords;
  }, {});
};

module.exports.GO = {
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

module.exports.sortByClosest = function sortByClosest(target, current) {
  return current.sort((a, b) => {
    const aYDistance = getDistanceBetween(target.y, a.y);
    const aXDistance = getDistanceBetween(target.x, a.x);

    const bYDistance = getDistanceBetween(target.y, b.y);
    const bXDistance = getDistanceBetween(target.x, b.x);
    const aTotal = aYDistance + aXDistance;
    const bTotal = bXDistance + bYDistance;

    return aTotal - bTotal;
  });
};
function getDistanceBetween(a, b) {
  return Math.abs(a - b);
}

module.exports.getDistanceBetween = getDistanceBetween;
