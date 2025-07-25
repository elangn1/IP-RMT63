if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/user");
const planRoutes = require("./routes/plan");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the User API" });
});

// user authentication routes
app.use("/users", userRoutes);

// plan routes
app.use("/plans", planRoutes);

app.use(errorHandler);

module.exports = app;
