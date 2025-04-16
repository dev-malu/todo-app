const express = require("express");
const router = express.Router();
const todoRouter = require("./todo");

router.use("/todo", todoRouter);

router.get("/", (req, res) => {
  res.send("Hello world");
});

module.exports = router;
