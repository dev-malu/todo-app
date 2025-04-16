const mongoose = require("mongoose");
const { TODO_STATUS_OPTIONS } = require("../constants/todo");
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: TODO_STATUS_OPTIONS,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
