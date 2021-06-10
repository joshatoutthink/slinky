var express = require("express");
const { move } = require("./move.js");
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
