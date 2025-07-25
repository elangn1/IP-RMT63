const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

module.exports = class UserController {
  static async register(req, res, next) {
    try {
      const createdUser = await User.create(req.body);

      res.status(201).json({
        id: createdUser.id,
        email: createdUser.email
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "BadRequest", message: "Email is required" };
      }

      if (!password) {
        throw { name: "BadRequest", message: "Password is required" };
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw { name: "Unauthorized", message: "error Invalid email or password" };
      }

      const isInvalidPassword = comparePassword(password, user.password);

      if (!isInvalidPassword) {
        throw { name: "Unauthorized", message: "error Invalid email or password" };
      }

      const accessToken = signToken({ id: user.id });
      res.status(200).json({ access_token: accessToken });
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    const { id_token } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const { name, email } = ticket.getPayload();
      // console.log(name, email, "<== name and email from google");

      let user = await User.findOne({ where: { email } });

      if (!user) {
        user = await User.create({
          name,
          email,
          password: Math.random().toString(36).slice(-8)
        });
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({ message: "Login Success", access_token });
    } catch (err) {
      next(err);
    }
  }
};
