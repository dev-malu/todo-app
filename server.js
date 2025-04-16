const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const routes = require("./router");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config(path.join(process.cwd(), ".env"));

async function runServer() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5500",
    })
  );
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/api", routes);

  const db = mongoose.connection;
  db.on("error", (error) => console.log(error));
  db.once("open", () => console.log("connected to mongoose"));

  await mongoose.connect(process.env.DATABASE_URL);

  const port = process.env.PORT || 3000;

  app.listen(port, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.info(`Server running on port ${port}`);
  });
}

runServer();
