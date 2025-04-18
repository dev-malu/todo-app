const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config(path.join(process.cwd(), ".env"));

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    }).exec();
    if (existingUser)
      return res.status(400).json({ message: "username already taken" });

    const user = new User({ email, username, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET,
      {
        expiresIn: "1hr",
      }
    );
    res.status(201).json({
      message: "User created successfully",
      token,
      user: { username: user.username },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user) {
      return res.status(400).json({ message: "Ivalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET,
      {
        expiresIn: "1hr",
      }
    );
    res.status(200).json({
      message: "Login successfull",
      token,
      user: { username: user.username },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
