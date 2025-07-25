const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

module.exports = async function authentication(req, res, next) {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    next({ name: "JsonWebTokenError", message: "Invalid token" });
    return;
  }

  try {
    const access_token = bearerToken.split(" ")[1];

    const decodedToken = verifyToken(access_token);

    const user = await User.findByPk(decodedToken.id);

    if (!user) {
      throw { name: "JsonWebTokenError", message: "Invalid token" };
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
