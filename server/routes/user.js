const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { route } = require("./user");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the User API" });
});

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/google-login", UserController.googleLogin);

module.exports = router;
