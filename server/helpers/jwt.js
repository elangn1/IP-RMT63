const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
// console.log("Environment variables check:");
// console.log("SECRET_KEY exists:", !!process.env.SECRET_KEY);
// console.log("SECRET_KEY length:", process.env.SECRET_KEY ? process.env.SECRET_KEY.length : 0);

const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET);
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken
};
