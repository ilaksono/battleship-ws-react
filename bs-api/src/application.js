const path = require("path");

const express = require("express");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

const game = {
  p1: [],
  p2: [],
}

module.exports = function application() {
  app.use(cors());
  app.use(helmet());
  app.use(bodyparser.json());


  app.post('/set', (req, res) => {



  });

  app.close = function () {
    return db.end();
  };

  return app;
};
