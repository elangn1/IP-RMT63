require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
const UserController = require("./controllers/UserController");
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", UserController.login);
app.post("/register", UserController.register);
app.post("/google-login", UserController.googleLogin);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
