const express = require("express");
const router = express.Router();
const todoRouter = require("./todo");
const userRouter = require("./user");
const authenticate = require("../middleware/auth");

router.use("/todo", authenticate, todoRouter);
router.use("/user", userRouter);

router.get("/", (req, res) => {
  res.send("Hello world");
});

module.exports = router;
