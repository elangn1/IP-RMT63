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

// user authentication routes
app.use("/", userRoutes);

// plan routes
app.use("/plans", planRoutes);

app.use(errorHandler);

module.exports = app;
