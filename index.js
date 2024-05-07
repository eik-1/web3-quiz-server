const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        ["http://localhost:3000", "https://your-production-domain.com"].indexOf(
          origin
        ) !== -1
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(bodyParser.json());

app.get("/questions", (req, res) => {
  const dataPath = path.join(__dirname, "questions.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading data file.");
    }
    let questions = JSON.parse(data);
    questions = questions.map((question) => ({
      id: question.id || uuidv4(),
      ...question,
    }));
    res.json(questions);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
