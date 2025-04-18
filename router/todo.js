const express = require("express");
const router = express.Router();
const path = require("path");
const Todo = require("../models/Todo");
const { TODO_STATUS_OPTIONS } = require("../constants/todo");

router.get("/", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const todos = await Todo.find({
      userId: req.userId,
      title: new RegExp(searchQuery, "i"),
    })
      .lean()
      .exec();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetchiing todos.." });
  }
});

router.get("/status-options", (req, res) => {
  res.json(TODO_STATUS_OPTIONS);
});

router.post("/", async (req, res) => {
  try {
    const newTodoItem = new Todo({
      title: req.body.title,
      date: req.body.date,
      status: req.body.status,
      userId: req.userId,
    });
    const todoItem = await newTodoItem.save();
    res.status(201).json({
      message: "Task created successfully",
      todoItem,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).where({
      userId: req.userId,
    });
    if (!updatedTodo)
      return res.status(404).json({ error: "TodoItem not found" });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteTodo = await Todo.findByIdAndDelete(req.params.id).where({
      userId: req.userId,
    });
    if (!deleteTodo)
      return res.status(404).json({ error: "Todo Item not found" });
    res.json({ message: "Todo Item deleted successfully", deleteTodo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
