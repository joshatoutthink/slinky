var express = require("express");
const { move } = require("./move.js");
var app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", slinky);
app.post("/start", start);
app.post("/move", (req, res) => {
  direction = move(req);
  res.status(200).json({
    move: direction,
  });
});
app.post("/end", end);
app.listen(PORT);
console.log(`go to http://localhost:${PORT}`);

function slinky(req, res) {
  res.status(200).json({
    apiversion: "1",
    author: "joshatoutthink",
    color: "#FD0AFF",
    head: "silly",
    tail: "round-bum",
    version: "final.final.production.final.2.0.-alpha-lol",
  });
}

function start(_, res) {
  console.log("GAME STARTING");
  res.status(200).send("ok");
}
function end() {
  console.log("GAME ENDED \n \n");
}
